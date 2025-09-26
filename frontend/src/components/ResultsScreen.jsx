import { CheckCircle, Star, ArrowRight, RefreshCw, TrendingUp, Award, Target, BarChart3, Sparkles } from 'lucide-react';

const ResultsScreen = ({ 
  assessmentData, 
  currentAssessment, 
  nextAssessment,
  onScreenChange, 
  onResetAssessment, 
  onStartNextAssessment,
  onGoToDashboard
}) => {
  const result = assessmentData[currentAssessment];

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="glass rounded-2xl p-8 text-center border border-purple-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">No results available</h2>
          <p className="text-gray-600 mb-4">It seems there was an issue processing your assessment.</p>
          <button 
            onClick={onGoToDashboard}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const getAssessmentIcon = (type) => {
    switch(type) {
      case 'stream': return <Target className="w-8 h-8 text-white" />;
      case 'degree': return <Award className="w-8 h-8 text-white" />;
      case 'specialization': return <TrendingUp className="w-8 h-8 text-white" />;
      default: return <CheckCircle className="w-8 h-8 text-white" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-100 border-blue-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Moderate Match';
    return 'Consider Alternatives';
  };

  // Determine what button to show based on next assessment
  const getActionButton = () => {
    if (nextAssessment) {
      return (
        <button 
          onClick={onStartNextAssessment}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105"
        >
          <span>Continue to {nextAssessment.charAt(0).toUpperCase() + nextAssessment.slice(1)} Assessment</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      );
    } else if (assessmentData.specialization) {
      return (
        <button 
          onClick={() => onScreenChange('colleges')}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105"
        >
          <span>Find Perfect Colleges</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      );
    } else {
      return (
        <button 
          onClick={onGoToDashboard}
          className="bg-white border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <span>Back to Dashboard</span>
        </button>
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="glass rounded-2xl p-8 border border-purple-100 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
            {getAssessmentIcon(currentAssessment)}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h2>
          <p className="text-gray-600">Here are your personalized results with detailed analysis</p>
        </div>

        {/* Score Display */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">Your Assessment Score</h3>
            </div>
            <div className={`px-4 py-2 rounded-full border font-semibold ${getScoreColor(result.score)}`}>
              {result.score}/100 - {getScoreLabel(result.score)}
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">{result.score}%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{result.confidence}%</div>
              <div className="text-sm text-gray-600">Confidence Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{result.answers?.length || 0}</div>
              <div className="text-sm text-gray-600">Questions Answered</div>
            </div>
          </div>

          {/* Score Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Score Breakdown</span>
              <span>{result.score}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${result.score}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Result */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6 border border-green-200">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Sparkles className="w-6 h-6 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Recommended: {result.primary}
              </h3>
            </div>
            <div className="flex items-center justify-center space-x-2 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-5 h-5 ${i < Math.floor(result.confidence / 20) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                />
              ))}
              <span className="text-sm font-semibold text-gray-700 ml-2">
                {result.confidence}% Confidence Match
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
              Why this recommendation?
            </h4>
            <p className="text-gray-700 mb-3">{result.reasoning}</p>
            
            {/* Detailed Analysis */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="font-medium text-blue-900 mb-2">Key Factors in Your Selection:</h5>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Strong analytical responses</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Consistent interest patterns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>High engagement scores</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Future market demand</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Options */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-purple-600" />
            Alternative Recommendations:
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {result.alternatives?.map((alt, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-800">{alt}</span>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-blue-500 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-blue-600">Excellent secondary choice based on your profile</p>
                <div className="mt-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {Math.floor(Math.random() * 20) + 70}% Match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Response Analysis */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Response Analysis</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-800 mb-3">Response Quality</h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Thoughtfulness</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                    <span className="text-xs text-gray-500">85%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Consistency</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: `${result.confidence}%`}}></div>
                    </div>
                    <span className="text-xs text-gray-500">{result.confidence}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Detail Level</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '78%'}}></div>
                    </div>
                    <span className="text-xs text-gray-500">78%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-800 mb-3">Interest Indicators</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm">Technical Aptitude</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">High</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm">Problem Solving</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Very High</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm">Leadership Potential</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Moderate</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm">Creative Thinking</span>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Good</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
          {getActionButton()}
          
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to retake this assessment? Your current results will be lost.')) {
                onResetAssessment();
                onStartNextAssessment(currentAssessment);
              }
            }}
            className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 border border-gray-300 hover:border-gray-400"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retake Assessment</span>
          </button>
        </div>

        {/* Progress Summary */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
          <h4 className="font-semibold text-gray-900 mb-4 text-center">Your Complete Journey Progress</h4>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className={`p-3 rounded-lg border-2 ${assessmentData.stream ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-500 border-gray-300'}`}>
              <div className="font-semibold mb-1">Stream Assessment</div>
              <div className="text-xs">{assessmentData.stream ? '✓ Complete' : 'Pending'}</div>
              {assessmentData.stream && (
                <div className="text-xs mt-1 font-medium">{assessmentData.stream.score}/100</div>
              )}
            </div>
            <div className={`p-3 rounded-lg border-2 ${assessmentData.degree ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-500 border-gray-300'}`}>
              <div className="font-semibold mb-1">Degree Assessment</div>
              <div className="text-xs">{assessmentData.degree ? '✓ Complete' : 'Pending'}</div>
              {assessmentData.degree && (
                <div className="text-xs mt-1 font-medium">{assessmentData.degree.score}/100</div>
              )}
            </div>
            <div className={`p-3 rounded-lg border-2 ${assessmentData.specialization ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-500 border-gray-300'}`}>
              <div className="font-semibold mb-1">Specialization</div>
              <div className="text-xs">{assessmentData.specialization ? '✓ Complete' : 'Pending'}</div>
              {assessmentData.specialization && (
                <div className="text-xs mt-1 font-medium">{assessmentData.specialization.score}/100</div>
              )}
            </div>
          </div>
          
          {/* Overall Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Overall Assessment Progress</span>
              <span>{Object.values(assessmentData).filter(Boolean).length}/3 Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${(Object.values(assessmentData).filter(Boolean).length / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Next Steps Guide */}
        {nextAssessment && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">What's Next?</h4>
                <p className="text-sm text-blue-700">
                  Complete your <strong>{nextAssessment}</strong> assessment to get comprehensive career guidance. 
                  Each assessment builds upon your previous responses for more accurate recommendations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Completion Message */}
        {!nextAssessment && assessmentData.specialization && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">Congratulations! 🎉</h4>
                <p className="text-sm text-green-700">
                  You've completed all assessments! Now you can explore colleges that match your chosen specialization.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsScreen;