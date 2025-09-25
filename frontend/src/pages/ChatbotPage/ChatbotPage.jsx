// Alternative version with modern back button
import React from "react";
import { useNavigate } from "react-router-dom";
import Chatbot from "../../components/Chatbot/Chatbot";

const ChatbotPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/'); // Navigate to home page
  };

  return (
    <div style={{ 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column",
      backgroundColor: "#f5f5f5" 
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: "#2c3e50",
        color: "white",
        padding: "15px 20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        gap: "15px"
      }}>
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "none",
            color: "white",
            cursor: "pointer",
            padding: "10px",
            borderRadius: "8px",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: "500"
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            e.target.style.transform = "translateX(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            e.target.style.transform = "translateX(0)";
          }}
          aria-label="Go back to home"
        >
          {/* Back Arrow SVG */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M12 19L5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>

        {/* Header Content */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: "24px" }}>Career Guidance Assistant</h1>
          <p style={{ margin: "5px 0 0 0", fontSize: "14px", opacity: 0.9 }}>
            Get personalized career advice and guidance
          </p>
        </div>

        {/* Spacer for centering */}
        <div style={{ width: "80px" }}></div>
      </div>
      
      {/* Chat Component */}
      <Chatbot />
    </div>
  );
};

export default ChatbotPage;