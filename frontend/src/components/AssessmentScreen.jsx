
import { ChevronRight, ArrowLeft, Brain, MessageSquare } from 'lucide-react';

const AssessmentScreen = ({ 
  currentAssessment, 
  currentQuestions, 
  questionIndex, 
  userInput, 
  setUserInput, 
  onAnswerSubmit, 
  onScreenChange 
}) => {
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
              <h2 className="text-2xl font-bold text-gray-900">
                {currentAssessment.charAt(0).toUpperCase() + currentAssessment.slice(1)} Assessment
              </h2>
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
            <h3 className="text-xl font-semibold text-gray-900 leading-relaxed">
              {currentQuestion.question}
            </h3>
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

          {/* Text Input Questions */}
          {currentQuestion.type === 'text' && (
            <div className="ml-14">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full text-black p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none h-32 font-medium"
                autoFocus
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  Share your thoughts in detail - this helps our AI understand you better
                </span>
                <span className="text-sm text-gray-400">
                  {userInput.length} characters
                </span>
              </div>
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
      </div>
    </div>
  );
};

export default AssessmentScreen;