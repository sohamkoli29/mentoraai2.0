
import {Student } from "@phosphor-icons/react";

const Navigation = ({ onScreenChange }) => {
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onScreenChange('home')}>
            <Student size={32} className="text-purple-600"/>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              MentoraAI
            </span>
          </div>
          <div className="flex space-x-6">
            <a href="#About">
            <button 
              onClick={() => onScreenChange('home')}
              className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium"
            >
              Home
            </button>
            </a>
            <a href="#home">
            <button  className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium">
              Dashboard
            </button>
            </a>
           
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;