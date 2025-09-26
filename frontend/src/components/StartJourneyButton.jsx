import { useContext } from "react";
import { ArrowRight } from "lucide-react";
import { AuthContext } from "../hooks/AuthContext";

function StartJourneyButton({ onStartAssessment }) {
  const { user } = useContext(AuthContext);

  const handleClick = () => {
    if (user) {
      console.log('Starting stream assessment from StartJourneyButton');
      onStartAssessment("stream");
    } else {
      // Dispatch event to open the global auth modal
      window.dispatchEvent(new CustomEvent('openLoginModal'));
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-flex items-center space-x-2"
    >
      <span>Start Your Journey</span>
      <ArrowRight className="w-5 h-5" />
    </button>
  );
}

export default StartJourneyButton;