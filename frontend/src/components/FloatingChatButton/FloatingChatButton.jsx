// components/FloatingChatButton/FloatingChatButton.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './FloatingChatButton.css';

const FloatingChatButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide button on chatbot page
  if (location.pathname === '/chatbot') {
    return null;
  }

  const handleClick = () => {
    navigate('/chatbot');
  };

  return (
    <div className="floating-chat-container">
      {/* Tooltip */}
      {isHovered && (
        <div className="chat-tooltip">
          <span>Career Guidance</span>
          <div className="tooltip-arrow"></div>
        </div>
      )}
      
      {/* Main Button */}
      <button
        className="floating-chat-button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Open Career Guidance Chat"
      >
        {/* Chat Icon SVG */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="chat-icon"
        >
          <path
            d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
            fill="currentColor"
          />
          <circle cx="8" cy="10" r="1.5" fill="#fff"/>
          <circle cx="12" cy="10" r="1.5" fill="#fff"/>
          <circle cx="16" cy="10" r="1.5" fill="#fff"/>
        </svg>
        
        {/* Pulse Animation Ring */}
        <div className="pulse-ring"></div>
      </button>
    </div>
  );
};

export default FloatingChatButton;