import { useState, useEffect } from 'react';
import { generateDynamicQuestions, analyzeAnswers } from '../utils/questionGenerator';

const useAssessment = (navigate) => {
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

  useEffect(() => {
    if (currentAssessment) {
      console.log('Generating questions for:', currentAssessment);
      const questions = generateDynamicQuestions(currentAssessment, answers);
      setCurrentQuestions(questions);
      console.log('Generated questions:', questions);
    }
  }, [currentAssessment, answers]);

  const startAssessment = (type) => {
    console.log('Starting assessment:', type);
    setCurrentAssessment(type);
    setQuestionIndex(0);
    setAnswers([]);
    setUserInput('');
    setCompletedAssessment(null);
  };

  // Modified to accept completion callback
  const handleAnswerSubmit = (onComplete) => {
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

    if (questionIndex < currentQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      console.log('Assessment complete, analyzing results...');
      const result = analyzeAnswers(currentAssessment, newAnswers);
      console.log('Analysis result:', result);
      
      setAssessmentData(prev => {
        const updated = { ...prev, [currentAssessment]: result };
        return updated;
      });
      
      setCompletedAssessment(currentAssessment);
      setQuestionIndex(0);
      setAnswers([]);
      
      // Call the completion callback with the completed assessment type
      if (onComplete) {
        onComplete(currentAssessment);
      }
      
      setCurrentAssessment(null);
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