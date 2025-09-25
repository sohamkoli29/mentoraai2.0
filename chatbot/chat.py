import random
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import threading
import time
app = Flask(__name__)
CORS(app)
# Load spaCy English model
try:
    nlp = spacy.load("en_core_web_sm")
    print("✅ spaCy model loaded successfully")
except OSError:
    print("❌ spaCy model not found. Please run: python -m spacy download en_core_web_sm")
    exit(1)

# --- Knowledge Base ---
courses = {
    "btech": ["engineering", "technology", "computer", "programming", "math", "physics", "btech", "coding", "software", "hardware", "algorithm", "data structure", "artificial intelligence", "machine learning", "ai", "ml"],
    "bsc": ["science", "biology", "chemistry", "physics", "mathematics", "experiments", "bsc", "research", "lab", "scientific", "botany", "zoology", "geology", "astronomy", "environmental science"],
    "ba": ["arts", "literature", "history", "psychology", "languages", "creative", "ba", "writing", "reading", "humanities", "philosophy", "sociology", "political science", "economics", "fine arts", "music", "dance"],
    "bba": ["business", "management", "marketing", "finance", "entrepreneurship", "bba", "leadership", "strategy", "sales", "human resources", "hr", "accounting", "administration", "startup", "commerce"],
    "bcom": ["commerce", "accounts", "finance", "taxation", "economics", "bcom", "banking", "audit", "investment", "stock market", "chartered accountant", "ca", "company secretary", "cs", "bank manager"]
}

course_info = {
    "btech": "🎯 B.Tech (Bachelor of Technology) is a 4-year engineering program focusing on practical technical skills. Excellent career opportunities in IT, software development, core engineering industries, research, and technology startups. High demand in job market with good salary packages.",
    "bsc": "🔬 B.Sc (Bachelor of Science) emphasizes scientific knowledge, laboratory experiments, and research opportunities. Leads to careers in research, healthcare, pharmaceuticals, environmental science, and academia. Can pursue MSc, PhD, or professional courses after graduation.",
    "ba": "📚 B.A (Bachelor of Arts) deals with arts, humanities, and social sciences. Offers diverse subjects like History, English, Psychology, Sociology, Political Science, Economics, and Languages. Careers in teaching, civil services, journalism, content writing, and social work.",
    "bba": "💼 BBA (Bachelor of Business Administration) focuses on management, marketing, finance, and HR. Ideal for aspiring entrepreneurs and business leaders. Often leads to MBA and careers in corporate management, marketing, finance, and human resources.",
    "bcom": "💰 B.Com (Bachelor of Commerce) is about commerce, accounts, and finance. Perfect for careers in banking, accounting, finance, insurance, and business. Pathway to professional courses like CA, CS, CMA, and MBA."
}

career_paths = {
    "btech": ["Software Engineer", "Data Scientist", "Mechanical Engineer", "AI/ML Specialist", "Cybersecurity Analyst", "Product Manager", "Research Scientist"],
    "bsc": ["Research Scientist", "Lab Technician", "Pharmacist", "Biotechnologist", "Environmental Analyst", "Science Professor", "Clinical Researcher"],
    "ba": ["Civil Servant", "Journalist", "Content Writer", "Psychologist", "Social Worker", "Teacher", "Public Relations Specialist"],
    "bba": ["Business Consultant", "Marketing Manager", "HR Manager", "Entrepreneur", "Financial Analyst", "Operations Manager", "Sales Director"],
    "bcom": ["Chartered Accountant", "Bank Manager", "Financial Analyst", "Company Secretary", "Tax Consultant", "Auditor", "Investment Banker"]
}

follow_up_questions = [
    "What subjects do you enjoy the most in school? Tell me about your favorite topics.",
    "Do you prefer working with technology, conducting experiments, creative writing, or business activities?",
    "Are you more interested in problem-solving, scientific research, artistic expression, or managing things?",
    "What kind of career environment appeals to you - corporate office, research lab, creative studio, or fieldwork?",
    "Do you see yourself working with computers, in a laboratory, with people, or with numbers?",
    "What are your strengths - analytical thinking, creativity, communication skills, or leadership qualities?",
    "How do you handle challenges - through technical solutions, research, creative approaches, or strategic planning?",
    "What extracurricular activities interest you - coding clubs, science fairs, debate, sports, or cultural events?",
    "Do you enjoy individual projects or team collaborations more?",
    "What kind of impact do you want to make - technological innovation, scientific discovery, social change, or business growth?"
]

greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "hola", "namaste"]
farewells = ["exit", "quit", "bye", "goodbye", "see you", "thanks bye", "stop", "end", "that's all", "thank you"]

# Enhanced synonyms for better NLP handling
synonyms = {
    "it": "technology", "computer science": "computer", "physics": "science", 
    "chem": "chemistry", "bio": "biology", "finance": "commerce", "history": "arts",
    "english": "arts", "math": "mathematics", "coding": "programming",
    "software": "technology", "hardware": "technology", "business": "management",
    "accounts": "commerce", "writing": "creative", "reading": "literature",
    "experiment": "science", "research": "science", "ai": "artificial intelligence",
    "ml": "machine learning", "hr": "human resources", "marketing": "business"
}

# Prepare TF-IDF
all_keywords = [" ".join(keywords) for keywords in courses.values()]
course_mapping = list(courses.keys())
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(all_keywords)

print("✅ TF-IDF vectorizer prepared")

# --- Helper Functions ---
def preprocess_text(text):
    """Clean and lemmatize user input"""
    text = text.lower()
    for key, val in synonyms.items():
        text = text.replace(key, val)
    doc = nlp(text)
    tokens = [token.lemma_ for token in doc if not token.is_stop and token.is_alpha]
    return " ".join(tokens)

def predict_course(user_input):
    """Predict course match percentages"""
    processed_input = preprocess_text(user_input)
    
    # Direct match fallback
    for course in courses:
        if course in processed_input:
            return {course: 100.0}

    user_vec = vectorizer.transform([processed_input])
    similarities = cosine_similarity(user_vec, X)
    scores = {course_mapping[i]: round(sim*100, 2) for i, sim in enumerate(similarities[0])}
    return scores

def get_greeting_response():
    """Return a comprehensive greeting response"""
    return """👋 Hello! I'm your Career Guidance Assistant! 

I'll help you discover the perfect career path by asking a series of questions about your interests, strengths, and goals.

I'll be asking multiple questions to understand you better. Just answer naturally, and I'll analyze your responses to suggest the best courses among:
• 🎯 B.Tech (Engineering & Technology)
• 🔬 B.Sc (Science & Research)  
• 📚 B.A (Arts & Humanities)
• 💼 BBA (Business Management)
• 💰 B.Com (Commerce & Finance)

Ready to begin? Let's start with your academic interests!"""

def format_scores(scores, show_all=False):
    """Format scores in a readable way"""
    if not any(score > 0 for score in scores.values()):
        return "I need more information to understand your interests better."
    
    # Only show courses with significant scores
    significant_scores = {k: v for k, v in scores.items() if v > 5}
    if not significant_scores:
        return "Keep sharing your interests so I can provide better recommendations!"
    
    sorted_scores = sorted(significant_scores.items(), key=lambda x: x[1], reverse=True)
    
    if show_all:
        response = "📊 CURRENT MATCH ANALYSIS:\n"
        for course, score in sorted_scores:
            response += f"• {course.upper()}: {score}% match\n"
    else:
        response = "📊 Based on our conversation:\n"
        for course, score in sorted_scores[:3]:  # Show top 3 only
            response += f"• {course.upper()}: {score}% match\n"
    
    return response

def get_multiple_questions(conversation_count):
    """Get 2-3 relevant questions based on conversation stage"""
    if conversation_count == 0:
        return [
            "What subjects do you enjoy the most in school?",
            "What kind of activities make you lose track of time?",
            "Do you prefer theoretical learning or practical applications?"
        ]
    elif conversation_count == 1:
        return [
            "Are you more interested in technology, science, arts, business, or commerce?",
            "What career fields have you considered so far?",
            "Do you enjoy working with numbers, people, ideas, or technology?"
        ]
    elif conversation_count == 2:
        return [
            "What are your strongest skills - analytical, creative, communication, or technical?",
            "Do you prefer office jobs, fieldwork, research, or creative work?",
            "What kind of work environment motivates you the most?"
        ]
    else:
        # Adaptive questions based on current scores
        return random.sample(follow_up_questions, 3)

def get_career_insights(top_course):
    """Get detailed career insights for the top matching course"""
    if top_course in career_paths:
        careers = career_paths[top_course]
        insight = f"\n🌟 TOP RECOMMENDATION: {top_course.upper()} 🌟\n"
        insight += f"{course_info[top_course]}\n\n"
        insight += "💼 Potential Career Paths:\n"
        for career in careers[:5]:
            insight += f"   • {career}\n"
        insight += f"\n📈 Next Steps: Consider internships, related projects, and skill development in this field!"
        return insight
    return ""

# --- Session Management for Web ---
session_store = {}

def get_session_id():
    """Generate a random session ID"""
    return f"session_{random.randint(1000, 9999)}"

# --- Enhanced Core Logic ---
def get_chatbot_response(user_input, session_id):
    """
    Enhanced chatbot logic with multiple questions and progressive analysis
    """
    
    # Initialize session state if it doesn't exist
    if session_id not in session_store:
        session_store[session_id] = {
            "accumulated_scores": {course: 0.0 for course in courses.keys()},
            "conversation_count": 0,
            "asked_questions": [],
            "user_interests": [],
            "conversation_stage": "initial"
        }
        
    state = session_store[session_id]
    accumulated_scores = state["accumulated_scores"]
    conversation_count = state["conversation_count"]
    user_interests = state["user_interests"]

    if not user_input:
        return {
            "response": "Please tell me something about your interests and preferences! 😊",
            "new_session": False,
            "questions_asked": 0
        }

    # Handle farewells/exit
    if any(farewell in user_input.lower() for farewell in farewells):
        response_parts = []
        response_parts.append("\n" + "="*50)
        response_parts.append("🎓 CAREER GUIDANCE SUMMARY")
        response_parts.append("="*50)
        
        # Final recommendations
        sorted_scores = sorted(accumulated_scores.items(), key=lambda x: x[1], reverse=True)
        top_courses = [c for c in sorted_scores if c[1] > 10]
        
        if top_courses:
            response_parts.append("\nYOUR PERSONALIZED COURSE MATCHES:")
            for course, score in top_courses[:3]:
                response_parts.append(f"\n🏆 {course.upper()}: {score:.1f}% match")
                response_parts.append(f"   {course_info[course]}")
                
                # Add career paths for top course
                if course == top_courses[0][0]:
                    careers = career_paths[course][:3]
                    response_parts.append(f"   💼 Top Careers: {', '.join(careers)}")
        else:
            response_parts.append("\n🤔 Keep exploring different subjects to discover your true passion!")
            response_parts.append("Consider talking to career counselors and trying internships in various fields.")
        
        response_parts.append("\n" + "="*50)
        response_parts.append("Thank you for the conversation! Wishing you success in your career journey! 🌟")
        response_parts.append("Type 'hi' to start a new session anytime!")
        
        # Clear session after farewell
        if session_id in session_store:
            del session_store[session_id]
            
        return {
            "response": "\n".join(response_parts), 
            "new_session": True,
            "questions_asked": 0
        }

    # Handle greetings - start new conversation
    if any(greeting in user_input.lower() for greeting in greetings):
        if session_id in session_store:
            del session_store[session_id]  # Clear previous session
        session_store[session_id] = {
            "accumulated_scores": {course: 0.0 for course in courses.keys()},
            "conversation_count": 0,
            "asked_questions": [],
            "user_interests": [],
            "conversation_stage": "initial"
        }
        state = session_store[session_id]
        
        questions = get_multiple_questions(0)
        state["asked_questions"] = questions
        
        response = get_greeting_response()
        response += "\n\n❓ Please answer these questions:\n"
        for i, question in enumerate(questions, 1):
            response += f"\n{i}. {question}"
            
        return {
            "response": response,
            "new_session": False,
            "questions_asked": len(questions)
        }

    # Process user input
    conversation_count += 1
    user_interests.append(user_input)
    round_scores = predict_course(user_input)
    
    # Update accumulated scores with intelligent weighting
    for course, score in round_scores.items():
        # Higher weight for recent inputs, diminishing for repeated patterns
        weight = 1.0 / (1 + accumulated_scores[course] / 100)
        accumulated_scores[course] += score * weight

    state["conversation_count"] = conversation_count
    state["accumulated_scores"] = accumulated_scores
    state["user_interests"] = user_interests

    # Generate comprehensive response
    response_parts = []
    
    # Add analysis of current input
    response_parts.append("✅ Thanks for sharing that!")
    
    # Show current match analysis after every 2 responses
    if conversation_count % 2 == 0:
        response_parts.append(format_scores(accumulated_scores, show_all=True))
    
    # Determine conversation stage and ask multiple questions
    if conversation_count <= 4:
        questions = get_multiple_questions(conversation_count)
        state["asked_questions"] = questions
        
        response_parts.append(f"\n❓ Let me ask you {len(questions)} more questions to understand you better:")
        for i, question in enumerate(questions, 1):
            response_parts.append(f"\n{i}. {question}")
        response_parts.append("\nPlease answer all questions in your response!")
        
    else:
        # After 4 exchanges, provide detailed analysis
        top_course = max(accumulated_scores.items(), key=lambda x: x[1])[0]
        response_parts.append("\n" + "="*40)
        response_parts.append("🎯 COMPREHENSIVE ANALYSIS")
        response_parts.append("="*40)
        response_parts.append(format_scores(accumulated_scores, show_all=True))
        response_parts.append(get_career_insights(top_course))
        response_parts.append("\n💡 Would you like me to explain any specific course in more detail?")
        response_parts.append("Or shall we explore alternative career paths?")

    session_store[session_id] = state

    return {
        "response": "\n".join(response_parts),
        "new_session": False,
        "questions_asked": len(state.get("asked_questions", []))
    }

# -------------------------------------------------------------------
# --- FLASK APPLICATION SETUP ---
# -------------------------------------------------------------------


# Enhanced HTML template
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Career Guidance Chatbot</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .chat-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 1000px;
            height: 85vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .chat-header {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 20px 20px 0 0;
        }
        .chat-header h2 {
            font-size: 28px;
            margin-bottom: 5px;
        }
        .chat-header p {
            font-size: 14px;
            opacity: 0.9;
        }
        .chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
            background: #f8f9fa;
        }
        .message {
            padding: 15px 20px;
            border-radius: 15px;
            max-width: 85%;
            line-height: 1.5;
            animation: fadeIn 0.3s ease-in;
            white-space: pre-line;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .user-message {
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 5px;
        }
        .bot-message {
            background: white;
            color: #333;
            align-self: flex-start;
            border-bottom-left-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border: 1px solid #e0e0e0;
        }
        .question-list {
            margin: 10px 0;
            padding-left: 20px;
        }
        .question-list li {
            margin: 8px 0;
            color: #2c3e50;
        }
        .chat-input-container {
            padding: 15px;
            background: white;
            border-top: 1px solid #e0e0e0;
            display: flex;
            gap: 10px;
            align-items: center;
        }
        #user-input {
            flex: 1;
            padding: 12px 20px;
            border: 2px solid #e0e0e0;
            border-radius: 25px;
            outline: none;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        #user-input:focus {
            border-color: #4CAF50;
        }
        #send-btn {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: transform 0.2s;
        }
        #send-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
        }
        #send-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        .typing-indicator {
            display: none;
            align-self: flex-start;
            background: white;
            padding: 12px 20px;
            border-radius: 25px;
            border-bottom-left-radius: 5px;
            color: #666;
            font-style: italic;
            border: 1px solid #e0e0e0;
        }
        .session-info {
            font-size: 12px;
            color: #666;
            text-align: center;
            padding: 5px;
            background: #f1f1f1;
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <div class="chat-header">
            <h2>🎓 Career Guidance Assistant</h2>
            <p>I'll ask multiple questions to provide personalized course recommendations</p>
        </div>
        <div class="session-info" id="session-info">
            Session: Starting...
        </div>
        <div class="chat-messages" id="chat-messages">
            <div class="message bot-message">
                👋 Hello! I'm your Career Guidance Assistant! 

I'll help you discover the perfect career path by asking a series of questions about your interests, strengths, and goals.

I'll be asking multiple questions to understand you better. Just answer naturally, and I'll analyze your responses to suggest the best courses.

Type 'hi' to begin or tell me about your interests!
            </div>
        </div>
        <div class="typing-indicator" id="typing-indicator">
            Career Assistant is analyzing your response...
        </div>
        <div class="chat-input-container">
            <input type="text" id="user-input" placeholder="Type your response here... (Say 'bye' to end session)" autocomplete="off">
            <button id="send-btn">Send</button>
        </div>
    </div>

    <script>
        const chatMessages = document.getElementById('chat-messages');
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');
        const typingIndicator = document.getElementById('typing-indicator');
        const sessionInfo = document.getElementById('session-info');
        
        let sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
        let questionsAsked = 0;
        
        updateSessionInfo('New session started');

        function updateSessionInfo(message) {
            sessionInfo.textContent = `Session: ${message} | Questions pending: ${questionsAsked}`;
        }

        function addMessage(message, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
            
            // Format message with proper line breaks and lists
            let formattedMessage = message.replace(/\\n/g, '<br>');
            formattedMessage = formattedMessage.replace(/•/g, '•');
            formattedMessage = formattedMessage.replace(/❓/g, '❓');
            formattedMessage = formattedMessage.replace(/✅/g, '✅');
            formattedMessage = formattedMessage.replace(/🎯/g, '🎯');
            formattedMessage = formattedMessage.replace(/🌟/g, '🌟');
            formattedMessage = formattedMessage.replace(/💼/g, '💼');
            formattedMessage = formattedMessage.replace(/📊/g, '📊');
            
            messageDiv.innerHTML = formattedMessage;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function showTypingIndicator() {
            typingIndicator.style.display = 'block';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function hideTypingIndicator() {
            typingIndicator.style.display = 'none';
        }

        async function sendMessage() {
            const message = userInput.value.trim();
            if (!message) return;

            addMessage(message, true);
            userInput.value = '';
            sendBtn.disabled = true;

            showTypingIndicator();
            updateSessionInfo('Processing...');

            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Session-ID': sessionId
                    },
                    body: JSON.stringify({ message: message })
                });

                const data = await response.json();
                hideTypingIndicator();
                
                addMessage(data.response);
                questionsAsked = data.questions_asked || 0;
                
                if (data.status === 'session_ended') {
                    updateSessionInfo('Session completed - say "hi" to start new');
                    sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
                    questionsAsked = 0;
                    setTimeout(() => {
                        addMessage("💡 Want to explore more? Type 'hi' to start a new career guidance session!");
                    }, 1000);
                } else {
                    updateSessionInfo(`Active - ${questionsAsked} questions pending`);
                }
            } catch (error) {
                hideTypingIndicator();
                addMessage('Sorry, I encountered an error. Please try again.');
                updateSessionInfo('Error occurred');
                console.error('Error:', error);
            } finally {
                sendBtn.disabled = false;
                userInput.focus();
            }
        }

        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // Auto-focus on input
        userInput.focus();

        // Add quick start tips
        setTimeout(() => {
            const tips = [
                "💡 Tip: You can type 'hi' to start a comprehensive career assessment",
                "💡 Tip: Answer multiple questions in one message for faster analysis",
                "💡 Tip: Say 'bye' anytime to get your personalized career summary"
            ];
            
            tips.forEach((tip, index) => {
                setTimeout(() => {
                    const tipDiv = document.createElement('div');
                    tipDiv.className = 'message bot-message';
                    tipDiv.style.fontSize = '13px';
                    tipDiv.style.opacity = '0.8';
                    tipDiv.style.backgroundColor = '#e3f2fd';
                    tipDiv.textContent = tip;
                    chatMessages.appendChild(tipDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, (index + 1) * 2000);
            });
        }, 3000);
    </script>
</body>
</html>
"""

@app.route('/')
def home():
    """Serve the chat interface"""
    print("📄 Serving enhanced career guidance interface...")
    try:
        if os.path.exists('templates') and os.path.exists('templates/index.html'):
            print("✅ Using template file: templates/index.html")
            return render_template('index.html')
        else:
            print("⚠️  Template file not found, using enhanced HTML")
            return HTML_TEMPLATE
    except Exception as e:
        print(f"❌ Error loading template: {e}")
        print("🔄 Using enhanced HTML as fallback")
        return HTML_TEMPLATE

@app.route('/chat', methods=['POST'])
def chat_api():
    """API endpoint to receive user input and return chatbot response."""
    print("💬 Enhanced Chat API called")
    
    data = request.get_json()
    
    if not data:
        print("❌ Invalid JSON data received")
        return jsonify({
            "response": "Invalid request format. Please send JSON data.",
            "session_id": "error",
            "status": "error",
            "questions_asked": 0
        }), 400
    
    user_input = data.get('message', '').strip()
    print(f"📩 User input: {user_input}")
    
    # Use session ID from header or generate new one
    session_id = request.headers.get('X-Session-ID', get_session_id())
    print(f"🔑 Session ID: {session_id}")

    # Handle empty input
    if not user_input:
        print("⚠️  Empty input received")
        return jsonify({
            "response": "Please tell me something about your interests and preferences! 😊",
            "session_id": session_id,
            "status": "waiting_for_input",
            "questions_asked": 0
        })

    try:
        # Get response from the enhanced core logic
        result = get_chatbot_response(user_input, session_id)
        print(f"🤖 Enhanced bot response generated (Questions asked: {result['questions_asked']})")
        
        return jsonify({
            "response": result["response"],
            "session_id": session_id,
            "status": "session_ended" if result["new_session"] else "active",
            "questions_asked": result["questions_asked"]
        })
    except Exception as e:
        print(f"❌ Error in enhanced chat processing: {e}")
        return jsonify({
            "response": "I'm having trouble processing your request. Please try again.",
            "session_id": session_id,
            "status": "error",
            "questions_asked": 0
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy', 
        'service': 'enhanced_career_chatbot',
        'sessions_active': len(session_store),
        'timestamp': random.randint(1000, 9999)
    })

@app.route('/courses', methods=['GET'])
def get_courses():
    """Endpoint to get information about all available courses"""
    return jsonify({
        'available_courses': list(courses.keys()),
        'course_details': course_info,
        'career_paths': career_paths
    })

@app.errorhandler(404)
def not_found(error):
    print("❌ 404 Error: Page not found")
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    print("❌ 500 Error: Internal server error")
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == "__main__":
    # Try multiple ports
    PORTS = [8000, 8001, 8002, 8080, 8081, 5000, 5001]
    
    for PORT in PORTS:
        try:
            print(f"\n🎓 ENHANCED Career Guidance Chatbot Server Starting...")
            print("=" * 60)
            print(f"🌐 Attempting to start on port: {PORT}")
            print(f"📊 Check if port is available...")
            
            # Test if port is available
            import socket
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                if s.connect_ex(('localhost', PORT)) == 0:
                    print(f"❌ Port {PORT} is busy, trying next...")
                    continue
            
            print(f"✅ Port {PORT} is available!")
            print("=" * 60)
            print(f"🚀 Starting server on: http://127.0.0.1:{PORT}")
            print(f"💬 API endpoint: http://127.0.0.1:{PORT}/chat")
            print(f"❤️  Health check: http://127.0.0.1:{PORT}/health")
            print(f"📚 Courses info: http://127.0.0.1:{PORT}/courses")
            print("=" * 60)
            print("✨ Enhanced Features:")
            print("   • Multiple questions per interaction")
            print("   • Progressive career analysis")
            print("   • Detailed course insights")
            print("   • Interactive session management")
            print("=" * 60)
            print("🎯 Server is running! Press Ctrl+C to stop")
            
            app.run(host='0.0.0.0', port=PORT, debug=False)
            break
            
        except Exception as e:
            print(f"❌ Failed to start on port {PORT}: {e}")
            continue
    else:
        print("❌ Could not start server on any port. All ports seem to be busy.")
        print("💡 Please close other applications or try again later.")