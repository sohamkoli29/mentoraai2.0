import  { useState } from 'react';
import { Clock, Calendar, CheckCircle, AlertCircle, ArrowLeft, Download, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const TimelineScreen = ({ selectedCollege}) => {
  const [notifications, setNotifications] = useState(true);


   const navigate = useNavigate();

     const handleFindColleges = () => {
    navigate('/colleges');
  };
     const handleHome = () => {
    navigate('/');
  };
  // Mock admission timeline data
  const admissionTimeline = [
    { 
      id: 1,
      date: 'March 1-15, 2024', 
      task: 'Application Submission', 
      status: 'upcoming',
      description: 'Submit online application with required documents',
      documents: ['10th Mark sheet', '12th Mark sheet', 'Entrance exam scorecard', 'Category certificate (if applicable)'],
      important: true
    },
    { 
      id: 2,
      date: 'March 20, 2024', 
      task: 'Application Fee Payment', 
      status: 'upcoming',
      description: 'Pay application processing fee',
      amount: '₹1,500',
      important: false
    },
    { 
      id: 3,
      date: 'April 10, 2024', 
      task: 'Entrance Examination', 
      status: 'upcoming',
      description: 'Appear for entrance exam at designated center',
      location: 'Multiple centers available',
      duration: '3 hours',
      important: true
    },
    { 
      id: 4,
      date: 'May 20, 2024', 
      task: 'Results Declaration', 
      status: 'upcoming',
      description: 'Entrance exam results and merit list publication',
      important: true
    },
    { 
      id: 5,
      date: 'June 1-15, 2024', 
      task: 'Counseling Process', 
      status: 'upcoming',
      description: 'Online counseling and seat allocation',
      phases: ['Choice filling', 'Seat allotment', 'Acceptance'],
      important: true
    },
    { 
      id: 6,
      date: 'June 20-25, 2024', 
      task: 'Document Verification', 
      status: 'upcoming',
      description: 'Physical document verification at college',
      location: selectedCollege.name,
      important: true
    },
    { 
      id: 7,
      date: 'June 30, 2024', 
      task: 'Fee Payment & Admission', 
      status: 'upcoming',
      description: 'Pay admission fees to confirm seat',
      amount: selectedCollege.fees,
      important: true
    },
    { 
      id: 8,
      date: 'July 15, 2024', 
      task: 'Academic Session Begins', 
      status: 'upcoming',
      description: 'Orientation and classes commence',
      important: false
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'current': return <Clock className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'upcoming': return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status, important = false) => {
    const base = important ? 'ring-2 ring-purple-200 ' : '';
    switch(status) {
      case 'completed': return base + 'border-green-200 bg-green-50';
      case 'current': return base + 'border-blue-200 bg-blue-50';
      case 'upcoming': return base + 'border-orange-200 bg-orange-50';
      default: return base + 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={handleFindColleges}
            className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Admission Timeline</h1>
        </div>
        <div className="glass rounded-xl p-4 border border-purple-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{selectedCollege.name}</h2>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span>Rank #{selectedCollege.ranking}</span>
            <span>•</span>
            <span>Fees: {selectedCollege.fees}</span>
            <span>•</span>
            <span>{selectedCollege.availableSeats} seats available</span>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="glass rounded-xl p-4 mb-8 border border-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-gray-900">Get deadline reminders</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
        {notifications && (
          <p className="text-sm text-gray-600 mt-2">We'll send you email reminders for important deadlines</p>
        )}
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {admissionTimeline.map((item, index) => (
          <div key={item.id} className="flex items-start space-x-4 animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                {getStatusIcon(item.status)}
              </div>
              {index < admissionTimeline.length - 1 && (
                <div className="w-0.5 h-16 bg-gradient-to-b from-purple-300 to-blue-300 mt-2"></div>
              )}
            </div>

            {/* Timeline Content */}
            <div className="flex-1 pb-8">
              <div className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${getStatusColor(item.status, item.important)}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                      <span>{item.task}</span>
                      {item.important && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          Important
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">{item.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'completed' ? 'bg-green-100 text-green-800' :
                      item.status === 'current' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{item.description}</p>

                {/* Additional Details */}
                <div className="space-y-3">
                  {item.documents && (
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">Required Documents:</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {item.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.amount && (
                    <div className="bg-white rounded-lg p-3 border">
                      <span className="font-semibold text-gray-900">Fee: </span>
                      <span className="text-purple-600 font-bold">{item.amount}</span>
                    </div>
                  )}

                  {item.location && (
                    <div className="bg-white rounded-lg p-3 border">
                      <span className="font-semibold text-gray-900">Location: </span>
                      <span className="text-gray-700">{item.location}</span>
                    </div>
                  )}

                  {item.duration && (
                    <div className="bg-white rounded-lg p-3 border">
                      <span className="font-semibold text-gray-900">Duration: </span>
                      <span className="text-gray-700">{item.duration}</span>
                    </div>
                  )}

                  {item.phases && (
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">Phases:</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.phases.map((phase, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {phase}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
        <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2">
          <Download className="w-5 h-5" />
          <span>Download Timeline PDF</span>
        </button>
        
        <button 
          onClick={handleHome}
          className="bg-white border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Important Notice */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Important Notice</h4>
            <p className="text-sm text-yellow-700">
              Dates and requirements may change. Please check the official college website regularly for updates. 
              We'll notify you of any changes if you have notifications enabled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineScreen;