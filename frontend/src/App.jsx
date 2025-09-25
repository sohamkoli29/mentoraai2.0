import React, { useState, useEffect } from 'react';
import { AuthProvider } from './hooks/AuthContext.jsx';
import { useAuth } from './hooks/useAuth.js';

// Components
import Navbar from './components/Navbar/Navbar.jsx';
import Dashboard from './components/Dashboard.jsx';
import AssessmentScreen from './components/AssessmentScreen';
import ResultsScreen from './components/ResultsScreen';
import CollegeSearch from './components/CollegeSearch';
import TimelineScreen from './components/TimelineScreen';
import Home from './components/Home/Home.jsx';
import AuthModal from './components/AuthModal/AuthModal.jsx';

// Hooks
import useAssessment from './hooks/useAssessment';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedCollege, setSelectedCollege] = useState(null);
  const { user } = useAuth();

  const {
    assessmentData,
    currentAssessment,
    questionIndex,
    userInput,
    currentQuestions,
    setUserInput,
    startAssessment,
    handleAnswerSubmit,
    resetAssessment,
  } = useAssessment(setCurrentScreen);

  // open login modal via global event
  useEffect(() => {
    const handleOpenLogin = () => setIsAuthModalOpen(true);
    window.addEventListener('openLoginModal', handleOpenLogin);
    return () => window.removeEventListener('openLoginModal', handleOpenLogin);
  }, []);

  const handleScreenChange = (screen, data = null) => {
    console.log('Changing screen to:', screen, 'with data:', data);
    setCurrentScreen(screen);

    if (screen === 'assessment' && data?.assessmentType) {
      startAssessment(data.assessmentType);
    }
  };

  const handleStartAssessment = (type) => {
    console.log('Starting assessment:', type);
    startAssessment(type);
    setCurrentScreen('assessment');
  };

  const handleCollegeSelect = (college) => {
    setSelectedCollege(college);
    setCurrentScreen('timeline');
  };

  const handleAuthSuccess = (user) => {
    console.log('User authenticated:', user);
    setIsAuthModalOpen(false);

    if (user) {
      setTimeout(() => {
        setCurrentScreen('dashboard'); // navigate to dashboard after login
      }, 100);
    }
  };

  const handleCloseModal = () => setIsAuthModalOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar
        onScreenChange={handleScreenChange}
        onLoginClick={() => setIsAuthModalOpen(true)}
      />
      <Home />
      {/* Screens controlled by currentScreen */}
      {currentScreen === 'home' && (
        <Dashboard
          assessmentData={assessmentData}
          onStartAssessment={handleStartAssessment}
          onScreenChange={handleScreenChange}
        />
      )}

      {currentScreen === 'assessment' && currentAssessment && (
        <AssessmentScreen
          currentAssessment={currentAssessment}
          currentQuestions={currentQuestions}
          questionIndex={questionIndex}
          userInput={userInput}
          setUserInput={setUserInput}
          onAnswerSubmit={handleAnswerSubmit}
          onScreenChange={handleScreenChange}
        />
      )}

      {currentScreen === 'results' && (
        <ResultsScreen
          assessmentData={assessmentData}
          currentAssessment={currentAssessment}
          onScreenChange={handleScreenChange}
          onResetAssessment={resetAssessment}
          onStartNextAssessment={handleStartAssessment}
        />
      )}

      {currentScreen === 'colleges' && (
        <CollegeSearch
          assessmentData={assessmentData}
          onCollegeSelect={handleCollegeSelect}
          onScreenChange={handleScreenChange}
        />
      )}

      {currentScreen === 'timeline' && selectedCollege && (
        <TimelineScreen
          selectedCollege={selectedCollege}
          onScreenChange={handleScreenChange}
        />
      )}

      {currentScreen === 'dashboard' && <Dashboard />}

      {/* Static Sections */}
      

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseModal}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;
