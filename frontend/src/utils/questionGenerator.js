// Enhanced AI-powered question generation and analysis utilities

export const generateDynamicQuestions = (assessmentType, previousAnswers = []) => {
  const questionPools = {
    stream: [
      {
        type: 'multiple',
        question: "Which activity excites you the most during free time?",
        options: ["Solving math puzzles and logical problems", "Reading about historical events and literature", "Conducting experiments and research", "Creating art, music, or designing things"]
      },
      {
        type: 'text',
        question: "Describe a challenging problem you recently solved and explain your approach:",
        placeholder: "Tell us about a time when you tackled a difficult challenge..."
      },
      {
        type: 'multiple',
        question: "In a group project, what role do you naturally take?",
        options: ["The organizer who plans and delegates", "The researcher who gathers information", "The creative mind who generates ideas", "The supporter who helps everyone collaborate"]
      },
      {
        type: 'scale',
        question: "How much do you enjoy working with numbers, data, and mathematical concepts?",
        min: 1,
        max: 10
      },
      {
        type: 'multiple',
        question: "Which subject area has always fascinated you the most?",
        options: ["Mathematics and Physics", "Economics and Business Studies", "Literature and Social Sciences", "Biology and Environmental Science"]
      }
    ],
    degree: [
      {
        type: 'multiple',
        question: "What kind of work environment do you see yourself thriving in?",
        options: ["Corporate offices with structured workflows", "Research labs and innovation centers", "Creative studios and collaborative spaces", "Healthcare facilities helping people"]
      },
      {
        type: 'text',
        question: "What impact do you want to make in the world through your career?",
        placeholder: "Describe the difference you want to make in society..."
      },
      {
        type: 'multiple',
        question: "Which type of work gives you the most satisfaction?",
        options: ["Strategic planning and business development", "Technical innovation and problem-solving", "Interpersonal communication and teamwork", "Creative expression and artistic pursuits"]
      },
      {
        type: 'scale',
        question: "How important is having a high salary versus job satisfaction for you?",
        min: 1,
        max: 10
      },
      {
        type: 'multiple',
        question: "What motivates you most in your studies and work?",
        options: ["Achieving measurable results and targets", "Discovering new knowledge and insights", "Helping others and making connections", "Creating something unique and meaningful"]
      }
    ],
    specialization: [
      {
        type: 'multiple',
        question: "Which emerging technology or field interests you the most?",
        options: ["Artificial Intelligence and Machine Learning", "Biotechnology and Genetic Engineering", "Renewable Energy and Sustainability", "Space Technology and Exploration"]
      },
      {
        type: 'text',
        question: "Describe your ideal job and work routine in detail:",
        placeholder: "Paint a picture of your perfect workday and career..."
      },
      {
        type: 'multiple',
        question: "How do you prefer to approach complex challenges?",
        options: ["Work independently with deep focus", "Collaborate in small specialized teams", "Lead diverse groups toward solutions", "Consult with experts and stakeholders"]
      },
      {
        type: 'scale',
        question: "How comfortable are you with continuous learning and adapting to new technologies?",
        min: 1,
        max: 10
      },
      {
        type: 'multiple',
        question: "What aspect of your chosen field excites you most?",
        options: ["Cutting-edge research and development", "Practical applications solving real problems", "Teaching and mentoring the next generation", "Entrepreneurship and business innovation"]
      }
    ]
  };

  // Get questions for the assessment type
  let questions = [...questionPools[assessmentType]];
  
  // AI Logic: Adapt questions based on previous answers (simplified)
  if (previousAnswers.length > 0) {
    const lastAnswer = previousAnswers[previousAnswers.length - 1];
    
    // Example adaptive logic - in production, this would use ML models
    if (assessmentType === 'degree' && lastAnswer.answer?.toLowerCase().includes('technical')) {
      questions.unshift({
        type: 'multiple',
        question: "Since you mentioned technical interests, which area appeals to you most?",
        options: ["Software Development and Programming", "Hardware Engineering and Electronics", "Data Analysis and Statistics", "System Design and Architecture"]
      });
    }
  }

  // Randomize questions for dynamic experience, but ensure variety
  return questions.sort(() => Math.random() - 0.5).slice(0, 4);
};

export const analyzeAnswers = (assessmentType, answerData) => {
  console.log('Analyzing answers for:', assessmentType);
  console.log('Answer data:', answerData);

  // Enhanced AI Analysis Logic - This simulates ML model processing
  const analysisResults = {
    stream: {
      primary: analyzeStreamPreference(answerData),
      alternatives: getStreamAlternatives(answerData),
      reasoning: generateStreamReasoning(answerData),
      confidence: calculateConfidence(answerData),
      score: calculateScore(answerData),
      answers: answerData // Store original answers for database
    },
    degree: {
      primary: analyzeDegreePreference(answerData),
      alternatives: getDegreeAlternatives(answerData),
      reasoning: generateDegreeReasoning(answerData),
      confidence: calculateConfidence(answerData),
      score: calculateScore(answerData),
      answers: answerData
    },
    specialization: {
      primary: analyzeSpecializationPreference(answerData),
      alternatives: getSpecializationAlternatives(answerData),
      reasoning: generateSpecializationReasoning(answerData),
      confidence: calculateConfidence(answerData),
      score: calculateScore(answerData),
      answers: answerData
    }
  };

  const result = analysisResults[assessmentType];
  console.log('Analysis result:', result);
  return result;
};

// Enhanced Analysis Helper Functions
const analyzeStreamPreference = (answers) => {
  const preferences = {
    science: 0,
    commerce: 0,
    arts: 0,
    medical: 0
  };

  answers.forEach(answer => {
    const response = answer.answer.toLowerCase();
    
    // Enhanced keyword analysis with weighted scoring
    if (response.includes('math') || response.includes('physics') || response.includes('experiment') || response.includes('technical') || response.includes('logic')) {
      preferences.science += 3;
    }
    if (response.includes('business') || response.includes('strategy') || response.includes('financial') || response.includes('economics') || response.includes('manage')) {
      preferences.commerce += 3;
    }
    if (response.includes('creative') || response.includes('art') || response.includes('literature') || response.includes('design') || response.includes('social')) {
      preferences.arts += 3;
    }
    if (response.includes('biology') || response.includes('health') || response.includes('medical') || response.includes('environmental') || response.includes('research')) {
      preferences.medical += 2;
    }

    // Scale questions analysis
    if (answer.question.type === 'scale') {
      const score = parseInt(answer.answer);
      if (answer.question.question.includes('numbers') || answer.question.question.includes('mathematical')) {
        if (score >= 7) preferences.science += 2;
        if (score >= 8) preferences.commerce += 1;
      }
    }
  });

  const maxPref = Math.max(...Object.values(preferences));
  const topStream = Object.keys(preferences).find(key => preferences[key] === maxPref);
  
  const streamMap = {
    science: "Science Stream (PCM)",
    commerce: "Commerce Stream", 
    arts: "Arts/Humanities Stream",
    medical: "Science Stream (PCB)"
  };

  return streamMap[topStream] || "Science Stream (PCM)";
};

const getStreamAlternatives = (answers) => {
  return ["Commerce Stream", "Arts/Humanities Stream"];
};

const generateStreamReasoning = (answers) => {
  const textAnswers = answers.filter(a => a.question.type === 'text');
  if (textAnswers.length > 0) {
    return `Based on your responses, particularly your approach to problem-solving and interests, this stream aligns well with your analytical mindset and career aspirations.`;
  }
  return "Based on your responses to our assessment questions, this stream matches your interests and aptitudes.";
};

const analyzeDegreePreference = (answers) => {
  const keywords = {
    'Computer Science Engineering': ['technical', 'technology', 'programming', 'software', 'computer', 'digital', 'innovation'],
    'Business Administration': ['business', 'management', 'strategy', 'leadership', 'finance', 'economics', 'corporate'],
    'Mechanical Engineering': ['engineering', 'design', 'manufacturing', 'automotive', 'machines', 'mechanical'],
    'Medicine (MBBS)': ['medical', 'health', 'healing', 'biology', 'research', 'helping people', 'healthcare'],
    'Psychology': ['people', 'behavior', 'social', 'communication', 'understanding', 'counseling'],
    'Fine Arts': ['creative', 'art', 'design', 'artistic', 'visual', 'aesthetic', 'expression']
  };

  const scores = {};
  Object.keys(keywords).forEach(degree => {
    scores[degree] = 0;
    answers.forEach(answer => {
      const response = answer.answer.toLowerCase();
      keywords[degree].forEach(keyword => {
        if (response.includes(keyword)) {
          scores[degree] += 1;
        }
      });
    });
  });

  const topDegree = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  return topDegree;
};

const getDegreeAlternatives = (answers) => {
  return ["Information Technology", "Data Science & Analytics"];
};

const generateDegreeReasoning = (answers) => {
  return "Your responses indicate strong alignment with technical fields that combine analytical thinking with practical problem-solving.";
};

const analyzeSpecializationPreference = (answers) => {
  const specializations = [
    "Artificial Intelligence & Machine Learning",
    "Cybersecurity",
    "Data Science & Big Data",
    "Software Development",
    "Digital Marketing",
    "Financial Technology (FinTech)",
    "Biotechnology",
    "Environmental Engineering"
  ];
  
  // Simple random selection for demo - in production, use ML analysis
  return specializations[Math.floor(Math.random() * specializations.length)];
};

const getSpecializationAlternatives = (answers) => {
  return ["Full Stack Development", "Cloud Computing"];
};

const generateSpecializationReasoning = (answers) => {
  return "Based on current industry trends and your interest profile, this specialization offers excellent growth opportunities.";
};

const calculateConfidence = (answers) => {
  // Calculate confidence based on answer consistency and completeness
  let confidence = 70; // Base confidence
  
  answers.forEach(answer => {
    if (answer.question.type === 'text' && answer.answer.length > 50) {
      confidence += 5; // Detailed answers increase confidence
    }
    if (answer.question.type === 'scale') {
      const score = parseInt(answer.answer);
      if (score >= 8 || score <= 2) {
        confidence += 3; // Strong preferences increase confidence
      }
    }
  });

  return Math.min(confidence, 95); // Cap at 95%
};

const calculateScore = (answers) => {
  // Calculate a composite score based on various factors
  let score = 0;
  let maxScore = 0;

  answers.forEach(answer => {
    maxScore += 10; // Each question worth 10 points max
    
    if (answer.question.type === 'scale') {
      score += parseInt(answer.answer);
    } else if (answer.question.type === 'text') {
      // Score text answers based on length and keywords
      const length = answer.answer.length;
      if (length > 100) score += 10;
      else if (length > 50) score += 7;
      else if (length > 20) score += 5;
      else score += 3;
    } else if (answer.question.type === 'multiple') {
      score += 8; // Standard score for multiple choice
    }
  });

  return Math.round((score / maxScore) * 100);
};

// API Integration Functions for Production
export const callMLModel = async (assessmentType, answers) => {
  try {
    const response = await fetch('/api/analyze-assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: assessmentType,
        answers: answers,
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) throw new Error('API call failed');
    return await response.json();
  } catch (error) {
    console.error('ML Model API Error:', error);
    return analyzeAnswers(assessmentType, answers); // Fallback to local analysis
  }
};

export const generateQuestionsWithAI = async (assessmentType, context) => {
  try {
    const response = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: assessmentType,
        context: context,
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) throw new Error('API call failed');
    return await response.json();
  } catch (error) {
    console.error('Question Generation API Error:', error);
    return generateDynamicQuestions(assessmentType, context); // Fallback to local generation
  }
};