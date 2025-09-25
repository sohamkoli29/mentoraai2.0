// src/services/supabaseService.js - Complete service layer for career guidance platform
import { supabase, getCurrentUser, getOrCreateUserProfile, trackAnalyticsEvent } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

class SupabaseService {
  constructor() {
    this.currentUser = null;
    this.currentSession = null;
  }

  // Initialize service with user authentication
  async initialize() {
    try {
      this.currentUser = await getCurrentUser();
      if (this.currentUser) {
        const profile = await getOrCreateUserProfile(this.currentUser);
        this.currentUser.profile = profile;
        
        // Track user session start
        await this.trackEvent('session_started', {
          user_id: this.currentUser.id,
          timestamp: new Date().toISOString()
        });
      }
      return this.currentUser;
    } catch (error) {
      console.error('Error initializing Supabase service:', error);
      return null;
    }
  }

  // Assessment Session Management
  async startAssessmentSession() {
    if (!this.currentUser) {
      throw new Error('User must be authenticated to start assessment');
    }

    const deviceInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    const { data, error } = await supabase
      .from('assessment_sessions')
      .insert([{
        user_id: this.currentUser.id,
        device_info: deviceInfo,
        current_status: 'in_progress'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating assessment session:', error);
      throw error;
    }

    this.currentSession = data;
    
    // Track session creation
    await this.trackEvent('assessment_session_started', {
      session_id: data.id,
      device_info: deviceInfo
    });

    return data;
  }

  async completeAssessmentSession() {
    if (!this.currentSession) return null;

    const { data, error } = await supabase
      .from('assessment_sessions')
      .update({
        session_completed_at: new Date().toISOString(),
        current_status: 'completed'
      })
      .eq('id', this.currentSession.id)
      .select()
      .single();

    if (error) {
      console.error('Error completing assessment session:', error);
      throw error;
    }

    // Track session completion
    await this.trackEvent('assessment_session_completed', {
      session_id: this.currentSession.id,
      duration_minutes: this.calculateSessionDuration()
    });

    return data;
  }

  // Assessment Data Management
  async saveAssessmentResult(assessmentType, questions, answers, aiAnalysis) {
    if (!this.currentUser || !this.currentSession) {
      throw new Error('User and session must be initialized');
    }

    const timeStarted = this.currentSession.session_started_at;
    const timeCompleted = new Date().toISOString();
    const timeTakenSeconds = Math.floor((new Date(timeCompleted) - new Date(timeStarted)) / 1000);

    const assessmentData = {
      id: uuidv4(),
      session_id: this.currentSession.id,
      user_id: this.currentUser.id,
      assessment_type: assessmentType,
      questions_data: questions,
      answers_data: answers,
      ai_analysis: aiAnalysis,
      score: aiAnalysis.score,
      confidence_level: aiAnalysis.confidence,
      time_taken_seconds: timeTakenSeconds,
      started_at: timeStarted,
      completed_at: timeCompleted
    };

    const { data, error } = await supabase
      .from('assessments')
      .insert([assessmentData])
      .select()
      .single();

    if (error) {
      console.error('Error saving assessment:', error);
      throw error;
    }

    // Update session with completed assessment count
    await this.updateSessionAssessmentCount();

    // Track assessment completion
    await this.trackEvent('assessment_completed', {
      assessment_type: assessmentType,
      score: aiAnalysis.score,
      confidence: aiAnalysis.confidence,
      time_taken: timeTakenSeconds,
      recommendation: aiAnalysis.primary
    });

    return data;
  }

  async updateSessionAssessmentCount() {
    if (!this.currentSession) return;

    const { data: assessments } = await supabase
      .from('assessments')
      .select('id')
      .eq('session_id', this.currentSession.id);

    await supabase
      .from('assessment_sessions')
      .update({ 
        total_assessments_completed: assessments?.length || 0 
      })
      .eq('id', this.currentSession.id);
  }

  // User Assessment History
  async getUserAssessmentHistory() {
    if (!this.currentUser) return [];

    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        assessment_sessions (
          session_started_at,
          session_completed_at
        )
      `)
      .eq('user_id', this.currentUser.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching assessment history:', error);
      return [];
    }

    return data || [];
  }

  async getLatestAssessments() {
    if (!this.currentUser) return null;

    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', this.currentUser.id)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching latest assessments:', error);
      return null;
    }

    // Convert to the format expected by the frontend
    const assessmentData = {
      stream: null,
      degree: null,
      specialization: null
    };

    data?.forEach(assessment => {
      assessmentData[assessment.assessment_type] = assessment.ai_analysis;
    });

    return assessmentData;
  }

  // College Search and Application Tracking
  async saveCollegeSearch(city, filters, query, resultsCount, collegesViewed = []) {
    if (!this.currentUser) return null;

    const searchData = {
      user_id: this.currentUser.id,
      session_id: this.currentSession?.id,
      search_city: city,
      search_filters: filters,
      search_query: query,
      results_count: resultsCount,
      colleges_viewed: collegesViewed
    };

    const { data, error } = await supabase
      .from('college_searches')
      .insert([searchData])
      .select()
      .single();

    if (error) {
      console.error('Error saving college search:', error);
      return null;
    }

    // Track search event
    await this.trackEvent('college_search_performed', {
      city: city,
      results_count: resultsCount,
      filters_applied: Object.keys(filters || {}).length,
      has_query: !!query
    });

    return data;
  }

  async saveCollegeApplication(collegeData, status = 'interested') {
    if (!this.currentUser) return null;

    const applicationData = {
      user_id: this.currentUser.id,
      session_id: this.currentSession?.id,
      college_name: collegeData.name,
      college_id: collegeData.id?.toString(),
      college_data: collegeData,
      application_status: status
    };

    const { data, error } = await supabase
      .from('college_applications')
      .insert([applicationData])
      .select()
      .single();

    if (error) {
      console.error('Error saving college application:', error);
      return null;
    }

    // Track application event
    await this.trackEvent('college_application_created', {
      college_name: collegeData.name,
      college_ranking: collegeData.ranking,
      application_status: status,
      college_type: collegeData.type
    });

    return data;
  }

  async updateCollegeApplicationStatus(applicationId, status) {
    const { data, error } = await supabase
      .from('college_applications')
      .update({ 
        application_status: status,
        applied_at: status === 'applied' ? new Date().toISOString() : null
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) {
      console.error('Error updating application status:', error);
      return null;
    }

    return data;
  }

  async getUserCollegeApplications() {
    if (!this.currentUser) return [];

    const { data, error } = await supabase
      .from('college_applications')
      .select('*')
      .eq('user_id', this.currentUser.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching college applications:', error);
      return [];
    }

    return data || [];
  }

  // Analytics and Event Tracking
  async trackEvent(eventName, eventData = {}) {
    if (!this.currentUser) return;

    const analyticsData = {
      user_id: this.currentUser.id,
      session_id: this.currentSession?.id,
      event_name: eventName,
      event_data: {
        ...eventData,
        page_url: window.location.href,
        timestamp: new Date().toISOString()
      },
      page_url: window.location.href,
      user_agent: navigator.userAgent
    };

    const { error } = await supabase
      .from('analytics_events')
      .insert([analyticsData]);

    if (error) {
      console.error('Error tracking analytics event:', error);
    }
  }

  // User Feedback
  async saveFeedback(feedbackType, rating, comments, pageContext) {
    if (!this.currentUser) return null;

    const feedbackData = {
      user_id: this.currentUser.id,
      session_id: this.currentSession?.id,
      feedback_type: feedbackType,
      rating: rating,
      comments: comments,
      page_context: pageContext
    };

    const { data, error } = await supabase
      .from('user_feedback')
      .insert([feedbackData])
      .select()
      .single();

    if (error) {
      console.error('Error saving feedback:', error);
      return null;
    }

    // Track feedback event
    await this.trackEvent('feedback_submitted', {
      feedback_type: feedbackType,
      rating: rating,
      page_context: pageContext
    });

    return data;
  }

  // User Profile Management
  async updateUserProfile(updates) {
    if (!this.currentUser) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', this.currentUser.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }

    // Update current user profile
    this.currentUser.profile = data;

    return data;
  }

  // Utility Methods
  calculateSessionDuration() {
    if (!this.currentSession?.session_started_at) return 0;
    
    const start = new Date(this.currentSession.session_started_at);
    const end = new Date();
    return Math.floor((end - start) / (1000 * 60)); // Duration in minutes
  }

  async getSessionAnalytics() {
    if (!this.currentUser) return null;

    const { data: sessions, error } = await supabase
      .from('assessment_sessions')
      .select(`
        *,
        assessments (count),
        college_searches (count),
        college_applications (count)
      `)
      .eq('user_id', this.currentUser.id);

    if (error) {
      console.error('Error fetching session analytics:', error);
      return null;
    }

    return sessions;
  }

  // Anonymous user support (for users not logged in)
  async saveAnonymousAssessment(assessmentData) {
    // For anonymous users, save to localStorage and optionally to a temporary table
    const anonymousId = localStorage.getItem('anonymous_user_id') || uuidv4();
    localStorage.setItem('anonymous_user_id', anonymousId);
    
    const storageKey = `anonymous_assessment_${anonymousId}`;
    const existingData = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    existingData[assessmentData.type] = {
      ...assessmentData,
      completedAt: new Date().toISOString()
    };
    
    localStorage.setItem(storageKey, JSON.stringify(existingData));
    
    return existingData;
  }

  async getAnonymousAssessments() {
    const anonymousId = localStorage.getItem('anonymous_user_id');
    if (!anonymousId) return null;
    
    const storageKey = `anonymous_assessment_${anonymousId}`;
    return JSON.parse(localStorage.getItem(storageKey) || '{}');
  }
}

// Export singleton instance
export default new SupabaseService();