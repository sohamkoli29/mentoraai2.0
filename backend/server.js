const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      fullName: user.full_name 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Validate input
    if (!email || !password || !fullName) {
      return res.status(400).json({ 
        message: 'Email, password, and full name are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in Supabase
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password_hash: hashedPassword,
          full_name: fullName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select('id, email, full_name, created_at')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        message: 'Failed to create user account' 
      });
    }

    // Generate JWT token
    const token = generateToken(newUser);

    // Return success response
    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.full_name,
        createdAt: newUser.created_at
      },
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, full_name, created_at')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Update last login
    await supabase
      .from('users')
      .update({ 
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    // Generate JWT token
    const token = generateToken(user);

    // Return success response
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        createdAt: user.created_at
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

// Get user profile endpoint
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, created_at, last_login')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        createdAt: user.created_at,
        lastLogin: user.last_login
      }
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

// === PROFILE ENDPOINTS ===

// Get user profile data
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Profile fetch error:', error);
      return res.status(500).json({ 
        message: 'Failed to fetch profile' 
      });
    }

    res.json({
      profile: profile || null
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

// Create or update user profile
app.post('/api/profile', authenticateToken, async (req, res) => {
  try {
    const profileData = {
      user_id: req.user.id,
      // Basic Information
      full_name: req.body.fullName,
      date_of_birth: req.body.dateOfBirth || null,
      age: req.body.age ? parseInt(req.body.age) : null,
      gender: req.body.gender || null,
      city: req.body.city || null,
      state: req.body.state || null,
      phone_number: req.body.phoneNumber || null,
      
      // Academic Background
      current_education_level: req.body.currentEducationLevel || null,
      stream: req.body.stream || null,
      school_college_name: req.body.schoolCollegeName || null,
      tenth_percentage: req.body.tenthPercentage ? parseFloat(req.body.tenthPercentage) : null,
      twelfth_percentage: req.body.twelfthPercentage ? parseFloat(req.body.twelfthPercentage) : null,
      
      
      
      // Career Preferences
     
      preferred_location: req.body.preferredLocation || null,
      
      
      // Skills & Interests
      
      
      // Goals & Aspirations
    
      
      updated_at: new Date().toISOString()
    };

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    let result;
    if (existingProfile) {
      // Update existing profile
      result = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('user_id', req.user.id)
        .select('*')
        .single();
    } else {
      // Create new profile
      profileData.created_at = new Date().toISOString();
      result = await supabase
        .from('user_profiles')
        .insert([profileData])
        .select('*')
        .single();
    }

    if (result.error) {
      console.error('Profile save error:', result.error);
      return res.status(500).json({ 
        message: 'Failed to save profile' 
      });
    }

    // Also update the user's full name in the users table if it changed
    if (req.body.fullName && req.body.fullName !== req.user.fullName) {
      await supabase
        .from('users')
        .update({ 
          full_name: req.body.fullName,
          updated_at: new Date().toISOString()
        })
        .eq('id', req.user.id);
    }

    res.json({
      message: 'Profile updated successfully',
      profile: result.data
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

// Get profile completion percentage
app.get('/api/profile/completion', authenticateToken, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ message: 'Failed to fetch profile' });
    }

    if (!profile) {
      return res.json({ completionPercentage: 0, missingFields: [] });
    }

    // Define required fields for profile completion
    const requiredFields = [
      'full_name', 'current_education_level', 
      
    ];
    
    const optionalFields = [
      'date_of_birth', 'city', 'state', 'stream', 'tenth_percentage',
      'twelfth_percentage', 'preferred_location'
    ];

    let completedRequired = 0;
    let completedOptional = 0;
    const missingFields = [];

    // Check required fields
    requiredFields.forEach(field => {
      const value = profile[field];
      if (value && (Array.isArray(value) ? value.length > 0 : value.trim())) {
        completedRequired++;
      } else {
        missingFields.push(field);
      }
    });

    // Check optional fields
    optionalFields.forEach(field => {
      const value = profile[field];
      if (value && (Array.isArray(value) ? value.length > 0 : value.trim())) {
        completedOptional++;
      }
    });

    // Calculate completion percentage
    const totalFields = requiredFields.length + optionalFields.length;
    const completedFields = completedRequired + completedOptional;
    const completionPercentage = Math.round((completedFields / totalFields) * 100);

    res.json({
      completionPercentage,
      completedRequired,
      totalRequired: requiredFields.length,
      completedOptional,
      totalOptional: optionalFields.length,
      missingFields
    });

  } catch (error) {
    console.error('Profile completion error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout endpoint (optional - mainly for token blacklisting if needed)
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  // In a real application, you might want to blacklist the token
  // For now, we'll just return a success message
  res.json({ message: 'Logged out successfully' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'Internal server error' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found' 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});