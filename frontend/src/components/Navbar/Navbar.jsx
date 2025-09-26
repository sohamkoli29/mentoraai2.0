import React from 'react';
import { Student } from "@phosphor-icons/react";

import { useAuth } from '../../hooks/useAuth';
import ViewProfileModal from "../../pages/ViewProfileModal/ViewProfileModal"; // adjust path if needed
import ProfileSetupModal from "../../pages/ProfileSetupModal/ProfileSetupModal"
// or if your bundler supports it:

import './Navbar.css';

function Navbar({ onLoginClick }) {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isProfileSetupOpen, setIsProfileSetupOpen] = React.useState(false);

  const handleProfileOpen = () => setIsProfileOpen(true);
  const handleProfileClose = () => setIsProfileOpen(false);

  const handleProfileSetupOpen = () => setIsProfileSetupOpen(true);
  const handleProfileSetupClose = () => setIsProfileSetupOpen(false);

  const handleLogout = () => {
    logout();
    // Optionally redirect to home page
    window.location.hash = '#home';
  };

  return (
    <>
    <nav>
      <div className="navleft">
        <Student size={32} />
        <div className="navLogo">
          <h1 className="logoFname">Mentora<span className='logoLname'>AI</span></h1>
        </div>
      </div>
      <div className="navRight">
        <div className="navLinks">
          <a href="#home">Home</a>
          {user && <a href="#dashboard">Dashboard</a>}
          <a href="#about">About</a>
          
          <a href="#contact">Contact</a>  
        </div>
        <div className="navLogin">
          {user ? (
            <div className="user-menu">
              <span className="welcome-text">Welcome, {user.fullName}!</span>
                <button onClick={handleProfileOpen} className="profile-btn">
      View Profile
                </button>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={onLoginClick} className="login-btn">Login</button>
          )}
        </div>
      </div>
    </nav>
 {isProfileOpen && (
  <ViewProfileModal
    isOpen={isProfileOpen}
    onClose={handleProfileClose}
    onEditProfile={() => {
      handleProfileClose();
      handleProfileSetupOpen();
    }}
  />
)}

{isProfileSetupOpen && (
  <ProfileSetupModal
    isOpen={isProfileSetupOpen}
    onClose={handleProfileSetupClose}
  />
)}

</>
  );
}


export default Navbar;