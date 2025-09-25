import React, { useState, useEffect } from 'react';
import { X, User, GraduationCap, Target, Award, Briefcase, Edit, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './ViewProfileModal.css';

function ViewProfileModal({ isOpen, onClose, onEditProfile }) {
  const { user, authenticatedFetch } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completionData, setCompletionData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadProfile();
      loadCompletionData();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch(`${import.meta.env.VITE_API_URL}/api/profile`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCompletionData = async () => {
    try {
      const response = await authenticatedFetch(`${import.meta.env.VITE_API_URL}/api/profile/completion`);
      if (response.ok) {
        const data = await response.json();
        setCompletionData(data);
      }
    } catch (err) {
      console.error('Failed to load completion data:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderArrayField = (array, emptyText = 'None specified') => {
    if (!array || array.length === 0) return emptyText;
    return (
      <div className="tag-list">
        {array.map((item, index) => (
          <span key={index} className="tag">{item}</span>
        ))}
      </div>
    );
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  if (!isOpen) return null;

  return (
    <div className="view-profile-overlay" onClick={onClose}>
      <div className="view-profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="view-profile-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="view-profile-header">
          <div className="profile-avatar-large">
            {getInitials(user?.fullName)}
          </div>
          <div className="profile-header-info">
            <h2>{user?.fullName || 'User Profile'}</h2>
            <p className="profile-email">{user?.email}</p>
            {completionData && (
              <div className="completion-indicator">
                <div className="completion-bar">
                  <div 
                    className="completion-fill" 
                    style={{ width: `${completionData.completionPercentage}%` }}
                  ></div>
                </div>
                <span className="completion-text">
                  {completionData.completionPercentage}% Complete
                </span>
              </div>
            )}
          </div>
          <button 
            className="edit-profile-btn"
            onClick={() => {
              onClose();
              onEditProfile();
            }}
          >
            <Edit size={18} />
            Edit Profile
          </button>
        </div>

        <div className="view-profile-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading profile...</p>
            </div>
          ) : !profile ? (
            <div className="empty-profile">
              <div className="empty-icon">
                <User size={48} />
              </div>
              <h3>No Profile Data</h3>
              <p>You haven't set up your profile yet. Click "Edit Profile" to get started!</p>
            </div>
          ) : (
            <div className="profile-sections">
              
              {/* Basic Information */}
              <div className="profile-section">
                <div className="section-header">
                  <User className="section-icon" />
                  <h3>Basic Information</h3>
                </div>
                <div className="section-grid">
                  <div className="info-item">
                    <Calendar className="info-icon" />
                    <div>
                      <label>Date of Birth</label>
                      <span>{formatDate(profile.date_of_birth)}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">🎂</span>
                    <div>
                      <label>Age</label>
                      <span>{profile.age || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">⚧</span>
                    <div>
                      <label>Gender</label>
                      <span>{profile.gender || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <MapPin className="info-icon" />
                    <div>
                      <label>Location</label>
                      <span>
                        {profile.city && profile.state 
                          ? `${profile.city}, ${profile.state}` 
                          : profile.city || profile.state || 'Not specified'}
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <Phone className="info-icon" />
                    <div>
                      <label>Phone Number</label>
                      <span>{profile.phone_number || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Background */}
              <div className="profile-section">
                <div className="section-header">
                  <GraduationCap className="section-icon" />
                  <h3>Academic Background</h3>
                </div>
                <div className="section-grid">
                  <div className="info-item">
                    <span className="info-icon">🎓</span>
                    <div>
                      <label>Education Level</label>
                      <span>{profile.current_education_level || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📚</span>
                    <div>
                      <label>Stream</label>
                      <span>{profile.stream || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="info-item full-width">
                    <span className="info-icon">🏫</span>
                    <div>
                      <label>Institution</label>
                      <span>{profile.school_college_name || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📊</span>
                    <div>
                      <label>Class 10th %</label>
                      <span>{profile.tenth_percentage ? `${profile.tenth_percentage}%` : 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">📈</span>
                    <div>
                      <label>Class 12th %</label>
                      <span>{profile.twelfth_percentage ? `${profile.twelfth_percentage}%` : 'Not specified'}</span>
                    </div>
                  </div>
                
              
                </div>
              </div>

              {/* Career Preferences */}
              <div className="profile-section">
                <div className="section-header">
                  <Target className="section-icon" />
                  <h3>Career Preferences</h3>
                </div>
                <div className="section-content">
                 
                  <div className="info-grid">
                    <div className="info-item">
                      <MapPin className="info-icon" />
                      <div>
                        <label>Preferred Location</label>
                        <span>{profile.preferred_location || 'Not specified'}</span>
                      </div>
                    </div>
                   
                  
                  </div>
                </div>
              </div>


            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewProfileModal;