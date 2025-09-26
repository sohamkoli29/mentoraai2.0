import { ChevronRight, ArrowLeft, Brain, MessageSquare, Volume2, Mic, MicOff } from 'lucide-react';
import { useState, useEffect } from 'react';

const AssessmentScreen = ({ 
  currentAssessment, 
  currentQuestions, 
  questionIndex, 
  userInput, 
  setUserInput, 
  onAnswerSubmit, 
  onScreenChange,
  assessmentData  
}) => {
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
    
  if (!currentQuestions || currentQuestions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="glass rounded-2xl p-8 text-center">
          <Brain className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Generating Questions...</h2>
          <p className="text-gray-600">Our AI is creating personalized questions for you</p>
        </div>
      </div>
    );
  }

  const currentQuestion = currentQuestions[questionIndex];

  // Get assessment title for display
  const getAssessmentTitle = (type) => {
    const titles = {
      'stream': 'Stream Selection Assessment',
      'degree': 'Degree Planning Assessment', 
      'specialization': 'Specialization Assessment'
    };
    return titles[type] || 'Career Assessment';
  };

  // Function to speak question + options
  const speakQuestion = (questionObj) => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support Text-to-Speech.");
      return;
    }

    // Construct text: question + options if multiple choice
    let textToSpeak = questionObj.question;
    if (questionObj.type === "multiple" && questionObj.options?.length > 0) {
      textToSpeak += ". Options are: " + questionObj.options.join(", ");
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "en-US";
    utterance.rate = 1; // speed
    utterance.pitch = 1; // tone

    window.speechSynthesis.cancel(); // stop any ongoing speech
    window.speechSynthesis.speak(utterance);
  };

  // Animated waveform component - simple and professional
  const WaveForm = () => {
    const bars = Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className="bg-purple-500 rounded-full"
        style={{
          width: '2px',
          height: isRecording ? `${8 + Math.sin(Date.now() / 200 + i) * 4}px` : '2px',
          transition: 'height 0.3s ease'
        }}
      />
    ));
    return (
      <div className="flex items-center space-x-1 h-4">
        {bars}
      </div>
    );
  };

  // Format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle recording function
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    const SpeechRecognition = 
      window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const newRecognition = new SpeechRecognition();
    newRecognition.lang = "en-US";
    newRecognition.continuous = true;
    newRecognition.interimResults = true;

    newRecognition.onstart = () => {
      setIsRecording(true);
      setRecordingTime(0);
    };

    newRecognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setUserInput((prev) => {
        const withoutInterim = prev.replace(/\[Recording...\].*$/, '').trim();
        return withoutInterim + (withoutInterim ? ' ' : '') + finalTranscript + 
               (interimTranscript ? ` [Recording...] ${interimTranscript}` : '');
      });
    };

    newRecognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      setRecordingTime(0);
    };

    newRecognition.onend = () => {
      setIsRecording(false);
      setRecordingTime(0);
      // Clean up any interim text
      setUserInput(prev => prev.replace(/\[Recording...\].*$/, '').trim());
    };

    setRecognition(newRecognition);
    newRecognition.start();
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
    setIsRecording(false);
    setRecordingTime(0);
    // Clean up any interim text
    setUserInput(prev => prev.replace(/\[Recording...\].*$/, '').trim());
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="glass rounded-2xl p-8 border border-purple-100 animate-fade-in-up">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onScreenChange('home')}
                className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {getAssessmentTitle(currentAssessment)}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {currentAssessment === 'stream' && 'Discover your ideal academic stream'}
                  {currentAssessment === 'degree' && 'Find your perfect degree program'}
                  {currentAssessment === 'specialization' && 'Choose your area of expertise'}
                </p>
              </div>
            </div>
            <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
              Question {questionIndex + 1} of {currentQuestions.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${((questionIndex + 1) / currentQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div className="flex justify-between items-start w-full">
              <h3 className="text-xl font-semibold text-gray-900 leading-relaxed">
                {currentQuestion.question}
              </h3>
              <button
                onClick={() => speakQuestion(currentQuestion)}
                className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center ml-4"
              >   
                <Volume2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Multiple Choice Questions */}
          {currentQuestion.type === 'multiple' && (
            <div className="space-y-3 ml-14">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setUserInput(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 transform hover:scale-[1.02] ${
                    userInput === option 
                      ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md' 
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      userInput === option ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                    }`}>
                      {userInput === option && (
                        <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Text Input Questions with Voice Recording */}
          {currentQuestion.type === 'text' && (
            <div className="ml-14">
              <div className="flex items-start space-x-2 mb-2">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className={`w-full text-black p-4 border-2 rounded-lg 
                             focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                             transition-colors resize-none h-32 font-medium ${
                               isRecording 
                                 ? 'border-purple-400 bg-purple-50' 
                                 : 'border-gray-200'
                             }`}
                  autoFocus
                />

                {/* Voice Recording Button */}
                <button
                  onClick={toggleRecording}
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    isRecording 
                      ? 'bg-red-500' 
                      : 'bg-gradient-to-r from-purple-600 to-blue-600'
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="w-6 h-6 text-white" />
                  ) : (
                    <Mic className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>

              {/* Recording status with waveform */}
              {isRecording && (
                <div className="flex items-center space-x-3 mb-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <WaveForm />
                  <span className="text-purple-600 font-medium text-sm">
                    Recording... {formatTime(recordingTime)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {isRecording 
                    ? "🎤 Recording voice input..." 
                    : "Share your thoughts in detail - this helps our AI understand you better"
                  }
                </span>
                <span className="text-sm text-gray-400">
                  {userInput.length} characters
                </span>
              </div>

              {/* Quick action hint */}
              {!isRecording && (
                <div className="mt-2 text-xs text-gray-400 flex items-center space-x-1">
                  <Mic className="w-3 h-3" />
                  <span>Tap microphone to record voice input</span>
                </div>
              )}
            </div>
          )}

          {/* Scale Questions */}
          {currentQuestion.type === 'scale' && (
            <div className="ml-14 space-y-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Not Interested (1)</span>
                <span>Extremely Interested (10)</span>
              </div>
              <div className="flex space-x-2 justify-center">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setUserInput(num.toString())}
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-200 font-semibold transform hover:scale-110 ${
                      userInput === num.toString()
                        ? 'border-purple-500 bg-purple-500 text-white shadow-lg'
                        : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              {userInput && (
                <div className="text-center mt-3">
                  <span className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                    Selected: {userInput}/10
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => onScreenChange('home')}
            className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
          >
            Save & Exit
          </button>
          
          <button
            onClick={onAnswerSubmit}
            disabled={!userInput}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transform hover:scale-105"
          >
            <span>
              {questionIndex < currentQuestions.length - 1 ? 'Next Question' : 'Complete Assessment'}
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            💡 <strong>Tip:</strong> Be honest and detailed in your responses. Our AI learns from your answers to provide better recommendations.
          </p>
        </div>

        {/* Assessment Progress Indicator */}
        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-purple-800">Assessment Progress:</span>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                currentAssessment === 'stream' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'
              }`}>Stream</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                currentAssessment === 'degree' ? 'bg-purple-600 text-white' : 
                assessmentData.stream ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
              }`}>Degree</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                currentAssessment === 'specialization' ? 'bg-purple-600 text-white' : 
                assessmentData.degree ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
              }`}>Specialization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentScreen;