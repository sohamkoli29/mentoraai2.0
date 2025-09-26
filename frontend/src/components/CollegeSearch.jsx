import { useState, useEffect } from 'react';
import { MapPin, Star, Users, DollarSign, TrendingUp, Search, Filter, Clock, Award, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const CollegeSearch = ({ assessmentData, onCollegeSelect }) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('ranking');
  const [filterBy, setFilterBy] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

   const navigate = useNavigate();

   const handleHome = () => {
    navigate('/');
  };


  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
    'Pune', 'Hyderabad', 'Ahmedabad', 'Jaipur', 'Lucknow',
    'Gurgaon', 'Noida', 'Indore', 'Bhopal', 'Kochi'
  ];

  // Complete college database with more realistic data
  const collegeData = {
    'Mumbai': [
      {
        id: 1,
        name: 'Indian Institute of Technology Bombay',
        ranking: 1,
        cutoff: '99.5%+',
        seats: 120,
        availableSeats: 8,
        fees: '₹2.5L/year',
        type: 'Government',
        specialties: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Aerospace Engineering'],
        rating: 4.8,
        placement: '98%',
        averagePackage: '₹18.5L',
        highestPackage: '₹45L',
        established: 1958,
        accreditation: 'NAAC A++',
        campus: '550 acres'
      },
      {
        id: 2,
        name: 'Veermata Jijabai Technological Institute',
        ranking: 15,
        cutoff: '95%+',
        seats: 180,
        availableSeats: 25,
        fees: '₹1.2L/year',
        type: 'Government',
        specialties: ['Computer Science', 'Information Technology', 'Electronics', 'Civil Engineering'],
        rating: 4.5,
        placement: '92%',
        averagePackage: '₹8.2L',
        highestPackage: '₹28L',
        established: 1887,
        accreditation: 'NAAC A+',
        campus: '50 acres'
      },
      {
        id: 3,
        name: 'Sardar Patel Institute of Technology',
        ranking: 35,
        cutoff: '90%+',
        seats: 240,
        availableSeats: 68,
        fees: '₹3.2L/year',
        type: 'Private',
        specialties: ['Computer Science', 'Information Technology', 'Mechanical Engineering', 'Electronics'],
        rating: 4.2,
        placement: '88%',
        averagePackage: '₹6.5L',
        highestPackage: '₹22L',
        established: 1962,
        accreditation: 'NAAC A',
        campus: '25 acres'
      },
      {
        id: 4,
        name: 'K.J. Somaiya College of Engineering',
        ranking: 42,
        cutoff: '88%+',
        seats: 300,
        availableSeats: 95,
        fees: '₹4.5L/year',
        type: 'Private',
        specialties: ['Computer Science', 'Information Technology', 'Electronics', 'Biomedical Engineering'],
        rating: 4.1,
        placement: '85%',
        averagePackage: '₹5.8L',
        highestPackage: '₹18L',
        established: 1983,
        accreditation: 'NAAC A',
        campus: '20 acres'
      }
    ],
    'Delhi': [
      {
        id: 5,
        name: 'Indian Institute of Technology Delhi',
        ranking: 2,
        cutoff: '99.2%+',
        seats: 150,
        availableSeats: 5,
        fees: '₹2.5L/year',
        type: 'Government',
        specialties: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Chemical Engineering'],
        rating: 4.9,
        placement: '99%',
        averagePackage: '₹20.1L',
        highestPackage: '₹50L',
        established: 1961,
        accreditation: 'NAAC A++',
        campus: '320 acres'
      },
      {
        id: 6,
        name: 'Delhi Technological University',
        ranking: 18,
        cutoff: '93%+',
        seats: 200,
        availableSeats: 32,
        fees: '₹1.8L/year',
        type: 'Government',
        specialties: ['Computer Science', 'Information Technology', 'Electronics', 'Software Engineering'],
        rating: 4.6,
        placement: '94%',
        averagePackage: '₹9.8L',
        highestPackage: '₹32L',
        established: 1941,
        accreditation: 'NAAC A+',
        campus: '164 acres'
      },
      {
        id: 7,
        name: 'Netaji Subhas University of Technology',
        ranking: 28,
        cutoff: '91%+',
        seats: 220,
        availableSeats: 45,
        fees: '₹1.5L/year',
        type: 'Government',
        specialties: ['Computer Science', 'Information Technology', 'Electronics', 'Instrumentation'],
        rating: 4.3,
        placement: '89%',
        averagePackage: '₹7.2L',
        highestPackage: '₹25L',
        established: 1983,
        accreditation: 'NAAC A',
        campus: '45 acres'
      }
    ],
    'Bangalore': [
      {
        id: 8,
        name: 'Indian Institute of Science',
        ranking: 1,
        cutoff: '99.8%+',
        seats: 80,
        availableSeats: 3,
        fees: '₹2.2L/year',
        type: 'Government',
        specialties: ['Computer Science', 'Data Science', 'AI & Machine Learning', 'Computational Sciences'],
        rating: 4.9,
        placement: '100%',
        averagePackage: '₹22.5L',
        highestPackage: '₹55L',
        established: 1909,
        accreditation: 'NAAC A++',
        campus: '460 acres'
      },
      {
        id: 9,
        name: 'RV College of Engineering',
        ranking: 25,
        cutoff: '92%+',
        seats: 280,
        availableSeats: 55,
        fees: '₹2.8L/year',
        type: 'Private',
        specialties: ['Computer Science', 'Information Science', 'Electronics', 'Biotechnology'],
        rating: 4.4,
        placement: '91%',
        averagePackage: '₹8.5L',
        highestPackage: '₹30L',
        established: 1963,
        accreditation: 'NAAC A+',
        campus: '52 acres'
      }
    ],
    'Chennai': [
      {
        id: 10,
        name: 'Indian Institute of Technology Madras',
        ranking: 3,
        cutoff: '99.1%+',
        seats: 140,
        availableSeats: 7,
        fees: '₹2.5L/year',
        type: 'Government',
        specialties: ['Computer Science', 'Electrical Engineering', 'Ocean Engineering', 'Aerospace Engineering'],
        rating: 4.8,
        placement: '98%',
        averagePackage: '₹19.2L',
        highestPackage: '₹48L',
        established: 1959,
        accreditation: 'NAAC A++',
        campus: '617 acres'
      },
      {
        id: 11,
        name: 'College of Engineering Guindy',
        ranking: 22,
        cutoff: '94%+',
        seats: 190,
        availableSeats: 28,
        fees: '₹0.8L/year',
        type: 'Government',
        specialties: ['Computer Science', 'Information Technology', 'Electronics', 'Production Engineering'],
        rating: 4.5,
        placement: '93%',
        averagePackage: '₹9.1L',
        highestPackage: '₹35L',
        established: 1794,
        accreditation: 'NAAC A+',
        campus: '150 acres'
      }
    ],
    'Pune': [
      {
        id: 12,
        name: 'College of Engineering Pune',
        ranking: 12,
        cutoff: '96%+',
        seats: 200,
        availableSeats: 22,
        fees: '₹1.1L/year',
        type: 'Government',
        specialties: ['Computer Science', 'Information Technology', 'Mechanical Engineering', 'Civil Engineering'],
        rating: 4.6,
        placement: '95%',
        averagePackage: '₹10.2L',
        highestPackage: '₹38L',
        established: 1854,
        accreditation: 'NAAC A+',
        campus: '115 acres'
      },
      {
        id: 13,
        name: 'Pune Institute of Computer Technology',
        ranking: 38,
        cutoff: '89%+',
        seats: 240,
        availableSeats: 72,
        fees: '₹3.8L/year',
        type: 'Private',
        specialties: ['Computer Science', 'Information Technology', 'Electronics & Telecommunication'],
        rating: 4.2,
        placement: '87%',
        averagePackage: '₹6.8L',
        highestPackage: '₹24L',
        established: 1999,
        accreditation: 'NAAC A',
        campus: '30 acres'
      }
    ]
  };

  useEffect(() => {
    if (selectedCity && collegeData[selectedCity]) {
      setLoading(true);
      // Simulate API call delay with realistic loading time
      setTimeout(() => {
        let filteredColleges = [...collegeData[selectedCity]];
        
        // Apply search filter
        if (searchQuery.trim()) {
          filteredColleges = filteredColleges.filter(college =>
            college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            college.specialties.some(spec => 
              spec.toLowerCase().includes(searchQuery.toLowerCase())
            )
          );
        }
        
        // Apply type filter
        if (filterBy !== 'all') {
          filteredColleges = filteredColleges.filter(college => 
            college.type.toLowerCase() === filterBy
          );
        }

        // Apply sorting
        filteredColleges.sort((a, b) => {
          switch(sortBy) {
            case 'ranking': 
              return a.ranking - b.ranking;
            case 'fees': 
              return parseFloat(a.fees.replace(/[₹L,]/g, '')) - parseFloat(b.fees.replace(/[₹L,]/g, ''));
            case 'availability': 
              return b.availableSeats - a.availableSeats;
            case 'rating': 
              return b.rating - a.rating;
            case 'placement':
              return parseFloat(b.placement.replace('%', '')) - parseFloat(a.placement.replace('%', ''));
            default: 
              return 0;
          }
        });

        setColleges(filteredColleges);
        setLoading(false);
      }, 1200);
    } else if (selectedCity && !collegeData[selectedCity]) {
      setColleges([]);
      setLoading(false);
    }
  }, [selectedCity, sortBy, filterBy, searchQuery]);

  const getAvailabilityColor = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'text-green-600 bg-green-100 border-green-200';
    if (percentage > 20) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getAvailabilityStatus = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'High Availability';
    if (percentage > 20) return 'Moderate Availability';
    if (percentage > 0) return 'Limited Seats';
    return 'Waitlist Only';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Perfect College
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Based on your assessment results: 
          <span className="font-bold text-purple-600 ml-2">
            {assessmentData.specialization?.primary || 'Complete your assessments first'}
          </span>
        </p>
        {assessmentData.specialization && (
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <span>Stream: {assessmentData.stream?.primary}</span>
            <span>•</span>
            <span>Degree: {assessmentData.degree?.primary}</span>
          </div>
        )}
      </div>

      {/* Search and Filter Controls */}
      <div className="glass rounded-2xl p-6 mb-8 border border-purple-100">
        {/* Search Bar */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Colleges</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by college name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City Preference</label>
            <select 
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select your preferred city</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="ranking">Best Ranking</option>
              <option value="fees">Lowest Fees</option>
              <option value="availability">Most Available Seats</option>
              <option value="rating">Highest Rating</option>
              <option value="placement">Best Placement</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">College Type</label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="government">Government</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex items-end">
            <button 
              onClick={() => {
                if (selectedCity) {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 1200);
                }
              }}
              disabled={!selectedCity}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 transform hover:scale-105"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="glass rounded-2xl p-12 text-center border border-purple-100">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Searching Colleges...</h3>
          <p className="text-gray-600 mb-4">Finding the best matches for your profile</p>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      )}

      {/* College Results */}
      {!loading && colleges.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {colleges.length} College{colleges.length > 1 ? 's' : ''} Found in {selectedCity}
            </h2>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></span>
                Live Data
              </span>
              <span className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          {colleges.map((college, index) => (
            <div key={college.id} className="glass rounded-2xl p-6 border border-purple-100 hover:shadow-xl transition-all duration-300 animate-fade-in-up transform hover:scale-[1.02]" style={{animationDelay: `${index * 100}ms`}}>
              {/* College Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-2xl font-bold text-gray-900">{college.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      college.type === 'Government' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {college.type}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      Est. {college.established}
                    </span>
                  </div>
                  
                  {/* Quick Stats Grid */}
                  <div className="grid md:grid-cols-5 gap-3 text-sm mb-4">
                    <div className="flex items-center space-x-2 bg-white/70 rounded-lg p-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">Rank #{college.ranking}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/70 rounded-lg p-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span>Cutoff: {college.cutoff}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/70 rounded-lg p-2">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                      <span>{college.fees}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/70 rounded-lg p-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span>{college.rating}/5 ★</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/70 rounded-lg p-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span>{college.accreditation}</span>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {college.specialties.map((specialty, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="ml-6 text-right">
                  <button 
                    onClick={() => onCollegeSelect(college)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 mb-3"
                  >
                    Apply Now
                  </button>
                  <div className={`text-sm font-medium px-3 py-1 rounded-full border ${getAvailabilityColor(college.availableSeats, college.seats)}`}>
                    {getAvailabilityStatus(college.availableSeats, college.seats)}
                  </div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid md:grid-cols-4 gap-4 p-4 bg-white/50 rounded-lg border border-gray-100 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{college.placement}</div>
                  <div className="text-sm text-gray-600">Placement Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{college.averagePackage}</div>
                  <div className="text-sm text-gray-600">Average Package</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{college.highestPackage}</div>
                  <div className="text-sm text-gray-600">Highest Package</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{college.campus}</div>
                  <div className="text-sm text-gray-600">Campus Size</div>
                </div>
              </div>

              {/* Seat Availability */}
              <div className="bg-white/70 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">Seat Availability</span>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {college.availableSeats}/{college.seats} seats ({Math.round((college.availableSeats / college.seats) * 100)}% available)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${(college.availableSeats / college.seats) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>Full Capacity ({college.seats})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results State */}
      {!loading && selectedCity && colleges.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center border border-purple-100">
          <MapPin className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">No colleges found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery ? 
              `No results for "${searchQuery}" in ${selectedCity}. Try adjusting your search terms or filters.` :
              `No colleges available in ${selectedCity} matching your criteria. Try selecting a different city or adjusting your filters.`
            }
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => {
                setSearchQuery('');
                setFilterBy('all');
              }}
              className="text-purple-600 hover:text-purple-700 font-medium border border-purple-300 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Clear Filters
            </button>
            <button 
              onClick={() => setSelectedCity('')}
              className="text-gray-600 hover:text-gray-700 font-medium"
            >
              Try Different City
            </button>
          </div>
        </div>
      )}

      {/* Initial State - No City Selected */}
      {!selectedCity && (
        <div className="glass rounded-2xl p-12 text-center border border-purple-100">
          <Search className="w-20 h-20 text-purple-400 mx-auto mb-6 animate-pulse" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Start Your College Search</h3>
          <p className="text-gray-600 mb-6">
            Select your preferred city to discover the best colleges for your chosen field. We'll show you real-time seat availability and detailed information.
          </p>
          {!assessmentData.specialization ? (
            <button 
              onClick={handleHome}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              Complete Assessments First →
            </button>
          ) : (
            <div className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg inline-block">
              ✓ Assessments completed - Ready to search colleges!
            </div>
          )}
        </div>
      )}

      {/* Summary Footer */}
      {colleges.length > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help Deciding?</h3>
            <p className="text-gray-600 mb-4">
              Our AI recommendations are based on your assessment results. Consider factors like ranking, fees, placement rates, and location convenience.
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span>Higher ranking = Better opportunities</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>Higher placement rate = Better job prospects</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeSearch;