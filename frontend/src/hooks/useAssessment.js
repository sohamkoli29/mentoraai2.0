import { useState, useEffect } from 'react';
import { generateDynamicQuestions, analyzeAnswers } from '../utils/questionGenerator';

const useAssessment = (setCurrentScreen) => {
  const [assessmentData, setAssessmentData] = useState({
    stream: null,
    degree: null,
    specialization: null
  });
  
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [completedAssessment, setCompletedAssessment] = useState(null);

  // Generate questions when assessment starts
  useEffect(() => {
    if (currentAssessment) {
      console.log('Generating questions for:', currentAssessment);
      const questions = generateDynamicQuestions(currentAssessment, answers);
      setCurrentQuestions(questions);
      console.log('Generated questions:', questions);
    }
  }, [currentAssessment]);

  const startAssessment = (type) => {
    console.log('Starting assessment:', type);
    setCurrentAssessment(type);
    setQuestionIndex(0);
    setAnswers([]);
    setUserInput('');
    setCompletedAssessment(null);
  };

  const handleAnswerSubmit = () => {
    if (!userInput.trim() && currentQuestions[questionIndex]?.type !== 'scale') {
      alert('Please provide an answer before continuing.');
      return;
    }

    const newAnswer = {
      questionIndex: questionIndex,
      question: currentQuestions[questionIndex], 
      answer: userInput,
      timestamp: new Date().toISOString()
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    setUserInput('');

    console.log('Answer submitted:', newAnswer);
    console.log('All answers so far:', newAnswers);

    if (questionIndex < currentQuestions.length - 1) {
      // Move to next question
      setQuestionIndex(questionIndex + 1);
    } else {
      // Assessment complete, analyze results
      console.log('Assessment complete, analyzing results...');
      const result = analyzeAnswers(currentAssessment, newAnswers);
      console.log('Analysis result:', result);
      
      // Store the result
      setAssessmentData(prev => {
        const updated = { ...prev, [currentAssessment]: result };
        console.log('Updated assessment data:', updated);
        return updated;
      });
      
      // Store completed assessment for results screen
      setCompletedAssessment(currentAssessment);
      
      // Reset assessment state
      setQuestionIndex(0);
      setAnswers([]);
      setCurrentAssessment(null);
      
      // Navigate to results screen
      setCurrentScreen('results');
    }
  };

  const resetAssessment = () => {
    setCurrentAssessment(null);
    setQuestionIndex(0);
    setAnswers([]);
    setUserInput('');
    setCompletedAssessment(null);
  };

  const clearAllAssessments = () => {
    setAssessmentData({
      stream: null,
      degree: null,
      specialization: null
    });
    resetAssessment();
  };

  // Function to get user's complete profile for database storage
  const getUserProfile = () => {
    return {
      assessmentData,
      completedAt: new Date().toISOString(),
      totalAnswers: Object.values(assessmentData).reduce((acc, assessment) => {
        return acc + (assessment?.answers?.length || 0);
      }, 0)
    };
  };

  return {
    assessmentData,
    currentAssessment: completedAssessment || currentAssessment,
    questionIndex,
    answers,
    userInput,
    currentQuestions,
    setUserInput,
    startAssessment,
    handleAnswerSubmit,
    resetAssessment,
    clearAllAssessments,
    setAssessmentData,
    getUserProfile
  };
};

export default useAssessment;