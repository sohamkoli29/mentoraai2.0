import React, { useState, useContext } from "react";
import AuthModal from "./AuthModal/AuthModal";
import { ArrowRight } from "lucide-react";
import { AuthContext } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom"; 



function StartJourneyButton({ onStartAssessment }) {
  const { user } = useContext(AuthContext);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleClick = () => {
    if (user) {
       onStartAssessment("stream")
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-flex items-center space-x-2"
      >
        <span>Start Your Journey</span>
        <ArrowRight className="w-5 h-5" />
      </button>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
}

export default StartJourneyButton;
