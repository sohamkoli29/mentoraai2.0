import React, { useState } from "react";
import { ArrowRight, BookOpen, Award, Target, CheckCircle, Star } from 'lucide-react';
import AuthModal from './AuthModal/AuthModal'
import { useAuth } from '../hooks/useAuth';
const Dashboard = ({ assessmentData, onStartAssessment, onScreenChange }) => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  return (
    <section id="dashboard"> 
    <div className="pt-[5.5rem] max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 animate-fade-in-up">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
         
          <span className=" bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Every Student Deserves a Mentor</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Find the perfect stream, degree, and specialization that matches your interests and aspirations.
        </p>
        {user ? (
  <button 
    onClick={() => onStartAssessment('stream')}
    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-flex items-center space-x-2"
  >
    <span>Start Your Journey</span>
    <ArrowRight className="w-5 h-5" />
  </button>
) : (
  <button 
    onClick={() => setShowAuthModal(true)} // <-- Trigger auth modal
    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-flex items-center space-x-2"
  >
    <span>Start Your Journey</span>
    <ArrowRight className="w-5 h-5" />
  </button>
)}
  {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
      </div>

      {/* Assessment Progress */}
      <div className="glass  rounded-2xl p-8 mb-12 border border-purple-100 animate-slide-in-right">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Your Assessment Journey</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Stream Assessment */}
          <div 
            className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-300" 
            onClick={() => onStartAssessment('stream')}
          >
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-200 ${
              assessmentData.stream ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
            }`}>
              {assessmentData.stream ? <CheckCircle className="w-8 h-8" /> : <BookOpen className="w-8 h-8" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Stream Selection</h3>
            <p className="text-gray-600 text-sm mb-4">Discover your ideal academic stream</p>
            {assessmentData.stream && (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="font-semibold text-green-800">{assessmentData.stream.primary}</p>
                <div className="flex items-center justify-center mt-1">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-xs text-green-600">{assessmentData.stream.confidence}% match</span>
                </div>
              </div>
            )}
          </div>

          {/* Degree Assessment */}
          <div 
            className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-300" 
            onClick={() => assessmentData.stream && onStartAssessment('degree')}
          >
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-200 ${
              assessmentData.degree ? 'bg-green-100 text-green-600' : 
              assessmentData.stream ? 'bg-purple-100 text-purple-600 group-hover:bg-purple-200' : 'bg-gray-100 text-gray-400'
            }`}>
              {assessmentData.degree ? <CheckCircle className="w-8 h-8" /> : <Award className="w-8 h-8" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Degree Planning</h3>
            <p className="text-gray-600 text-sm mb-4">Find your perfect degree program</p>
            {assessmentData.degree && (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="font-semibold text-green-800">{assessmentData.degree.primary}</p>
                <div className="flex items-center justify-center mt-1">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-xs text-green-600">{assessmentData.degree.confidence}% match</span>
                </div>
              </div>
            )}
          </div>

          {/* Specialization Assessment */}
          <div 
            className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-300" 
            onClick={() => assessmentData.degree && onStartAssessment('specialization')}
          >
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-200 ${
              assessmentData.specialization ? 'bg-green-100 text-green-600' : 
              assessmentData.degree ? 'bg-purple-100 text-purple-600 group-hover:bg-purple-200' : 'bg-gray-100 text-gray-400'
            }`}>
              {assessmentData.specialization ? <CheckCircle className="w-8 h-8" /> : <Target className="w-8 h-8" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Specialization</h3>
            <p className="text-gray-600 text-sm mb-4">Choose your area of expertise</p>
            {assessmentData.specialization && (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="font-semibold text-green-800">{assessmentData.specialization.primary}</p>
                <div className="flex items-center justify-center mt-1">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-xs text-green-600">{assessmentData.specialization.confidence}% match</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-sm text-gray-600">Assessment Progress:</span>
            <span className="text-sm font-semibold text-purple-600">
              {Object.values(assessmentData).filter(Boolean).length}/3 Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(Object.values(assessmentData).filter(Boolean).length / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      {assessmentData.specialization && (
        <div className="glass rounded-2xl p-8 border border-purple-100 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Ready for the Next Step?</h2>
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Great! You've completed all assessments. Now let's find the perfect colleges for your chosen path.
            </p>
            <button 
              onClick={() => onScreenChange('colleges')}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-flex items-center space-x-2"
            >
              <span>Find Colleges</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Features Section */}
      
       <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Features</h2>
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 glass rounded-xl border border-purple-100 hover:shadow-lg transition-shadow duration-300">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Dynamic Assessments</h3>
          <p className="text-gray-600 text-sm">AI-powered questions that adapt to your responses for personalized insights</p>
        </div>

        <div className="text-center p-6 glass rounded-xl border border-purple-100 hover:shadow-lg transition-shadow duration-300">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Recommendations</h3>
          <p className="text-gray-600 text-sm">Get primary choices plus alternatives based on advanced AI analysis</p>
        </div>

        <div className="text-center p-6 glass rounded-xl border border-purple-100 hover:shadow-lg transition-shadow duration-300">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Data</h3>
          <p className="text-gray-600 text-sm">Live college information, seat availability, and admission timelines</p>
        </div>
      </div>
    </div>
    </section>
  );
};

export default Dashboard;