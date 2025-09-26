
import { X, User,  GraduationCap, Target,  } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './ProfileSetupModal.css';

function ProfileSetupModal({ isOpen, onClose, onProfileUpdated }) {
  const { user, authenticatedFetch } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    // Basic Information
    fullName: user?.fullName || '',
    dateOfBirth: '',
    age: '',
    gender: '',
    city: '',
    state: '',
    phoneNumber: '',
    
    // Academic Background
    currentEducationLevel: '',
    stream: '',
    schoolCollegeName: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    graduationCGPA: '',
    currentCGPA: '',
    
    // Career Preferences
    careerInterests: [],
    preferredLocation: '',
    targetSalary: '',
    workExperience: '',
    
    // Skills & Interests
    technicalSkills: [],
    softSkills: [],
    hobbies: [],
    languages: [],
    
    // Goals & Aspirations
    shortTermGoals: '',
    longTermGoals: '',
    dreamCompanies: '',
    additionalInfo: ''
  });

  // Education level options
  const educationLevels = [
    'Class 10th (Completed)',
    'Class 10th (Pursuing)',
    'Class 12th (Completed)', 
    'Class 12th (Pursuing)',
    'Diploma (Completed)',
    'Diploma (Pursuing)',
   
  ];

  const streams = [
    'Science (PCM)', 'Science (PCB)', 'Science (PCMB)',
    'Commerce (with Maths)', 'Commerce (without Maths)',
    'Arts/Humanities', 'Other'
  ];





  useEffect(() => {
    if (isOpen && user) {
      // Load existing profile data if available
      loadProfileData();
    }
  }, [isOpen, user]);

  const loadProfileData = async () => {
    try {
      const response = await authenticatedFetch(`${import.meta.env.VITE_API_URL}/api/profile`);
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setFormData(prev => ({ ...prev, ...data.profile }));
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'dateOfBirth' && value) {
      // Auto-calculate age from date of birth
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      setFormData(prev => ({ ...prev, [name]: value, age: age.toString() }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    setError('');
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const currentValues = prev[field] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.currentEducationLevel) {
      setError('Current education level is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await authenticatedFetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
      
      if (onProfileUpdated) {
        onProfileUpdated(data.profile);
      }

      // Close modal after 1.5 seconds
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="profile-modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="profile-modal-header">
          <h2>Complete Your Profile</h2>
          <p>Help us personalize your career guidance experience</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {/* Basic Information Section */}
          <div className="form-section">
            <div className="section-header">
              <User className="section-icon" />
              <h3>Basic Information</h3>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Age"
                  min="10"
                  max="100"
                />
              </div>
              <div className="form-group">
                <label>Gender (Optional)</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Your city"
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Your state"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>

          {/* Academic Background Section */}
          <div className="form-section">
            <div className="section-header">
              <GraduationCap className="section-icon" />
              <h3>Academic Background</h3>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Current Education Level *</label>
                <select
                  name="currentEducationLevel"
                  value={formData.currentEducationLevel}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Education Level</option>
                  {educationLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Stream/Subject</label>
                <select
                  name="stream"
                  value={formData.stream}
                  onChange={handleInputChange}
                >
                  <option value="">Select Stream</option>
                  {streams.map(stream => (
                    <option key={stream} value={stream}>{stream}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>School/College Name</label>
              <input
                type="text"
                name="schoolCollegeName"
                value={formData.schoolCollegeName}
                onChange={handleInputChange}
                placeholder="Institution name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Class 10th Percentage</label>
                <input
                  type="number"
                  name="tenthPercentage"
                  value={formData.tenthPercentage}
                  onChange={handleInputChange}
                  placeholder="85.5"
                  step="0.01"
                  min="0"
                  max="100"
                />
              </div>
              <div className="form-group">
                <label>Class 12th Percentage</label>
                <input
                  type="number"
                  name="twelfthPercentage"
                  value={formData.twelfthPercentage}
                  onChange={handleInputChange}
                  placeholder="82.3"
                  step="0.01"
                  min="0"
                  max="100"
                />
              </div>
            </div>

         
          </div>

          {/* Career Preferences Section */}
          <div className="form-section">
            <div className="section-header">
              <Target className="section-icon" />
              <h3>Career Preferences</h3>
            </div>

          

            <div className="form-row">
              <div className="form-group">
                <label>Preferred Work Location</label>
                <input
                  type="text"
                  name="preferredLocation"
                  value={formData.preferredLocation}
                  onChange={handleInputChange}
                  placeholder="Mumbai, Bangalore, Remote, etc."
                />
              </div>
             
            </div>

            
          </div>

       
          

         

          {/* Form Actions */}
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                'Save Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetupModal;