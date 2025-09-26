import { useState, useEffect } from 'react';
import {  Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthContext.jsx';
import { useAuth } from './hooks/useAuth.js';
import { Brain, BarChart3 } from 'lucide-react';

// Components
import Navbar from './components/Navbar/Navbar.jsx';
import Dashboard from './components/Dashboard.jsx';
import AssessmentScreen from './components/AssessmentScreen';
import ResultsScreen from './components/ResultsScreen';
import CollegeSearch from './components/CollegeSearch';
import TimelineScreen from './components/TimelineScreen';
import Home from './components/Home/Home.jsx';
import AuthModal from './components/AuthModal/AuthModal.jsx';
import ChatbotPage from './pages/ChatbotPage/ChatbotPage';
import Contact from './components/Contact/Contaxt.jsx'
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
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [nextAssessment, setNextAssessment] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
  } = useAssessment(navigate);

  // Sync URL with screen state and handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== getCurrentRoute()) {
        navigate(`/${hash}`);
      }
    };

    if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      navigate(`/${hash}`);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [navigate]);

  const getCurrentRoute = () => {
    const path = location.pathname.replace('/', '');
    return path || 'home';
  };

  // Open login modal via global event
  useEffect(() => {
    const handleOpenLogin = () => setIsAuthModalOpen(true);
    window.addEventListener('openLoginModal', handleOpenLogin);
    return () => window.removeEventListener('openLoginModal', handleOpenLogin);
  }, []);

  const getNextAssessmentType = (completedAssessment) => {
    if (completedAssessment === 'stream') return 'degree';
    if (completedAssessment === 'degree') return 'specialization';
    return null;
  };

  const handleScreenChange = (screen, data = null) => {
    console.log('Changing screen to:', screen, 'with data:', data);
    
    if (screen === 'assessment' && data?.assessmentType) {
      startAssessment(data.assessmentType);
      navigate('/assessment');
    } else {
      navigate(`/${screen}`);
    }
  };

  const handleStartAssessment = (type) => {
    console.log('Starting assessment:', type);
    startAssessment(type);
    navigate('/assessment');
  };

  const handleStartNextAssessment = () => {
    if (nextAssessment) {
      console.log('Starting next assessment:', nextAssessment);
      startAssessment(nextAssessment);
      setNextAssessment(null);
      navigate('/assessment');
    }
  };

  const handleCollegeSelect = (college) => {
    setSelectedCollege(college);
    navigate('/timeline');
  };

  const handleAuthSuccess = (user) => {
    console.log('User authenticated:', user);
    setIsAuthModalOpen(false);

    if (user) {
      setTimeout(() => {
        navigate('/home');
      }, 100);
    }
  };

  const handleCloseModal = () => setIsAuthModalOpen(false);

  const handleAssessmentComplete = (assessmentType) => {
    const nextType = getNextAssessmentType(assessmentType);
    setNextAssessment(nextType);
    navigate('/results');
  };

  // Combined Home/Dashboard Page Component
  const HomeDashboardPage = () => (
    <div>
      <Home />
      <Dashboard
        assessmentData={assessmentData}
        onStartAssessment={handleStartAssessment}
        onScreenChange={handleScreenChange}
      />
      <Contact/>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {!location.pathname.includes('/chatbot') && (
        <Navbar onLoginClick={() => setIsAuthModalOpen(true)} />
      )}
      
      <Routes>
        {/* Combined Home and Dashboard on the same page */}
        <Route path="/" element={<HomeDashboardPage />} />
        <Route path="/home" element={<HomeDashboardPage />} />
        <Route path="/dashboard" element={<HomeDashboardPage />} />
        <Route path="/contact" element={<HomeDashboardPage/>}/>
        {/* Assessment Route */}
        <Route path="/assessment" element={
          currentAssessment && currentQuestions && currentQuestions.length > 0 ? (
            <AssessmentScreen
              currentAssessment={currentAssessment}
              currentQuestions={currentQuestions}
              questionIndex={questionIndex}
              userInput={userInput}
              setUserInput={setUserInput}
              onAnswerSubmit={() => {
                handleAnswerSubmit(() => handleAssessmentComplete(currentAssessment));
              }}
              onScreenChange={handleScreenChange}
              assessmentData={assessmentData}
            />
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-12 pt-20">
              <div className="glass rounded-2xl p-8 text-center border border-purple-100">
                <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Assessment Not Ready</h2>
                <p className="text-gray-600 mb-6">
                  {!currentAssessment ? 
                    "No assessment has been started. Please select an assessment to begin." :
                    "The assessment questions are still being prepared. Please wait a moment."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => navigate('/home')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Go to Dashboard
                  </button>
                  {!currentAssessment && (
                    <button 
                      onClick={() => handleStartAssessment('stream')}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                    >
                      Start Stream Assessment
                    </button>
                  )}
                </div>
                {currentAssessment && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-700">
                      💡 If this message persists, try refreshing the page or starting a new assessment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        } />
        
        {/* Results Route */}
        <Route path="/results" element={
          currentAssessment && assessmentData[currentAssessment] ? (
            <ResultsScreen
              assessmentData={assessmentData}
              currentAssessment={currentAssessment}
              nextAssessment={nextAssessment}
              onScreenChange={handleScreenChange}
              onResetAssessment={resetAssessment}
              onStartNextAssessment={handleStartNextAssessment}
              onGoToDashboard={() => navigate('/home')}
            />
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-12 pt-20">
              <div className="glass rounded-2xl p-8 text-center border border-purple-100">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Results Not Available</h2>
                <p className="text-gray-600 mb-6">
                  {!currentAssessment ? 
                    "No assessment has been completed yet." :
                    "The assessment results are still being processed or may have encountered an error."
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => navigate('/home')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Back to Dashboard
                  </button>
                  {!currentAssessment && (
                    <button 
                      onClick={() => handleStartAssessment('stream')}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                    >
                      Start Your First Assessment
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        } />
        
        {/* Other routes remain the same */}
        <Route path="/colleges" element={
          <CollegeSearch
            assessmentData={assessmentData}
            onCollegeSelect={handleCollegeSelect}
            onScreenChange={handleScreenChange}
          />
        } />
        
        <Route path="/timeline" element={
          selectedCollege ? (
            <TimelineScreen
              selectedCollege={selectedCollege}
              onScreenChange={handleScreenChange}
            />
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-12 pt-20">
              <div className="glass rounded-2xl p-8 text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">No College Selected</h2>
                <button 
                  onClick={() => navigate('/colleges')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Choose a College
                </button>
              </div>
            </div>
          )
        } />
        
        <Route path="/chatbot" element={<ChatbotPage />} />
        
        <Route path="/about" element={
          <div className="max-w-4xl mx-auto px-4 py-12 pt-20">
            <div className="glass rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">About Us</h2>
              <p className="text-gray-600">About page content goes here...</p>
            </div>
          </div>
        } />
        
     
        
        <Route path="*" element={
          <div className="max-w-4xl mx-auto px-4 py-12 pt-20">
            <div className="glass rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
              <button 
                onClick={() => navigate('/home')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                Go Home
              </button>
            </div>
          </div>
        } />
      </Routes>

      {!location.pathname.includes('/chatbot') && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={handleCloseModal}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}

export default App;