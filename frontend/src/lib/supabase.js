// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
};

// Helper function to get or create user profile
export const getOrCreateUserProfile = async (user) => {
  if (!user) return null;

  // First, try to get existing profile
  const { data: existingProfile, error: fetchError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (existingProfile && !fetchError) {
    return existingProfile;
  }

  // If profile doesn't exist, create it
  const newProfile = {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || '',
    created_at: new Date().toISOString()
  };

  const { data: createdProfile, error: createError } = await supabase
    .from('user_profiles')
    .insert([newProfile])
    .select()
    .single();

  if (createError) {
    console.error('Error creating user profile:', createError);
    return null;
  }

  return createdProfile;
};

// Auth helper functions
export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signUpWithEmail = async (email, password, userData = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Database helper functions
export const createAssessmentSession = async (userId, deviceInfo = {}) => {
  const { data, error } = await supabase
    .from('assessment_sessions')
    .insert([{
      user_id: userId,
      device_info: deviceInfo,
      current_status: 'in_progress'
    }])
    .select()
    .single();

  return { data, error };
};

export const updateAssessmentSession = async (sessionId, updates) => {
  const { data, error } = await supabase
    .from('assessment_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();

  return { data, error };
};

export const saveAssessment = async (assessmentData) => {
  const { data, error } = await supabase
    .from('assessments')
    .insert([assessmentData])
    .select()
    .single();

  return { data, error };
};

export const getUserAssessments = async (userId) => {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const saveCollegeSearch = async (searchData) => {
  const { data, error } = await supabase
    .from('college_searches')
    .insert([searchData])
    .select()
    .single();

  return { data, error };
};

export const saveCollegeApplication = async (applicationData) => {
  const { data, error } = await supabase
    .from('college_applications')
    .insert([applicationData])
    .select()
    .single();

  return { data, error };
};

export const trackAnalyticsEvent = async (eventData) => {
  const { data, error } = await supabase
    .from('analytics_events')
    .insert([eventData]);

  return { data, error };
};

export const saveFeedback = async (feedbackData) => {
  const { data, error } = await supabase
    .from('user_feedback')
    .insert([feedbackData])
    .select()
    .single();

  return { data, error };
};