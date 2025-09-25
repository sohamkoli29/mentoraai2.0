
import './Home.css';
import { FaTasks } from "react-icons/fa";
import { AiOutlineAreaChart } from "react-icons/ai";
import { GiBulletImpacts } from "react-icons/gi";
function Home() {
  return (
    <section id="home" className="about-section">
      <div className="about-content">
        <h1 className="about-title"> Welcome To MentoraAI</h1>
        <p className="about-description">
          MentoraAI is an AI-powered Career Guidance Ecosystem designed to
          empower students and government colleges. Our platform provides
          personalized career paths, real-time college admission tracking, and
          success stories that inspire students to achieve their goals.
        </p>
        <div className="about-cards">
          <div className="about-card">
            <h3> <FaTasks /> Mission</h3>
            <p>To provide every student a reliable and personalized mentor.</p>
          </div>
          <div className="about-card">
            <h3> <AiOutlineAreaChart /> Reach</h3>
            <p>Designed for inclusivity with offline-first and multi-language support.</p>
          </div>
          <div className="about-card">
            <h3> <GiBulletImpacts /> Impact</h3>
            <p>Helping students make evidence-based career choices, reducing dropouts.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
    