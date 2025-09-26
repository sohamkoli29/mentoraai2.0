

const QuestionCard = ({ question }) => {
  const speakQuestion = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US"; // set language
    speech.pitch = 1;      // voice pitch
    speech.rate = 1;       // speed
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="p-4 border rounded-xl shadow">
      <p className="text-lg">{question}</p>
      <button
        onClick={() => speakQuestion(question)}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        🔊 Listen
      </button>
    </div>
  );
};

export default QuestionCard;
