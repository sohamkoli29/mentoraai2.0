import random
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
# --- Added Flask for web service functionality ---
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Load spaCy English model
nlp = spacy.load("en_core_web_sm")

# --- Knowledge Base ---
courses = {
    "btech": ["engineering", "technology", "computer", "programming", "math", "physics", "btech", "coding", "software", "hardware"],
    "bsc": ["science", "biology", "chemistry", "physics", "mathematics", "experiments", "bsc", "research", "lab", "scientific"],
    "ba": ["arts", "literature", "history", "psychology", "languages", "creative", "ba", "writing", "reading", "humanities"],
    "bba": ["business", "management", "marketing", "finance", "entrepreneurship", "bba", "leadership", "strategy", "sales"],
    "bcom": ["commerce", "accounts", "finance", "taxation", "economics", "bcom", "banking", "audit", "investment"]
}

course_info = {
    "btech": "B.Tech is a 4-year engineering program with excellent career options in IT and core industries.",
    "bsc": "B.Sc emphasizes scientific knowledge, experiments, and research opportunities.",
    "ba": "B.A deals with arts, humanities, and social sciences like History, English, and Psychology.",
    "bba": "BBA focuses on management, marketing, finance, and HR, often leading to MBA.",
    "bcom": "B.Com is about commerce, accounts, and finance, ideal for banking and CA/CS careers."
}

follow_up_questions = [
    "What subjects do you enjoy the most in school?",
    "Do you prefer working with technology, conducting experiments, or creative writing?",
    "Are you more interested in problem-solving, business strategies, or artistic expression?",
    "What kind of career are you imagining for yourself?",
    "Do you see yourself working in a lab, office, creative studio, or tech company?"
]

greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"]
farewells = ["exit", "quit", "bye", "goodbye", "see you", "thanks bye"]

# Synonyms for better NLP handling
synonyms = {
    "it": "technology",
    "computer science": "computer",
    "physics": "science",
    "chem": "chemistry",
    "bio": "biology",
    "finance": "commerce",
    "history": "arts",
    "english": "arts",
    "math": "mathematics"
}

# Prepare TF-IDF
all_keywords = [" ".join(keywords) for keywords in courses.values()]
course_mapping = list(courses.keys())
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(all_keywords)

# --- Helper Functions (UNCHANGED) ---
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
    """Return a random greeting response"""
    greetings_responses = [
        "Hello! I'm here to help you explore career options. Tell me about your interests!",
        "Hi there! Let's discover which course might be perfect for you. What are you passionate about?",
        "Welcome! I can help guide you toward B.Tech, B.Sc, B.A, BBA, or B.Com. What subjects do you enjoy?"
    ]
    return random.choice(greetings_responses)

def format_scores(scores):
    """Format scores in a readable way"""
    if not any(score > 0 for score in scores.values()):
        return "I need a bit more information to make good recommendations."
    
    # Only show courses with significant scores
    significant_scores = {k: v for k, v in scores.items() if v > 5}
    if not significant_scores:
        return "Keep telling me about your interests so I can better understand your preferences!"
    
    sorted_scores = sorted(significant_scores.items(), key=lambda x: x[1], reverse=True)
    
    response = "Based on what you've told me:\n"
    for course, score in sorted_scores[:3]:  # Show top 3 only
        response += f"• {course.upper()}: {score}% match\n"
    
    return response

# --- Session Management for Web (NEW) ---
# This dictionary will store the conversation state for different users/sessions
# In a real app, this would be a database/cache.
session_store = {} 

def get_session_id(request):
    # In a real web app, you'd use cookies or tokens. 
    # For this simple API, we'll use a hardcoded default ID.
    # In a more advanced Flask app, you'd integrate session handling.
    return "default_user_session"

# --- Core Logic adapted for Web/API use (MODIFIED) ---
def get_chatbot_response(user_input, session_id):
    """
    Core chatbot logic adapted to take input and session ID, 
    and return a response, updating the session state.
    """
    
    # Initialize session state if it doesn't exist
    if session_id not in session_store:
        session_store[session_id] = {
            "accumulated_scores": {course: 0.0 for course in courses.keys()},
            "conversation_count": 0
        }
        
    state = session_store[session_id]
    accumulated_scores = state["accumulated_scores"]
    conversation_count = state["conversation_count"]

    if not user_input:
        return {"response": "Please tell me something about your interests! 😊", "new_session": False}

    # Handle farewells/exit
    if any(farewell in user_input.lower() for farewell in farewells):
        response_parts = []
        response_parts.append("\n" + "=" * 40)
        response_parts.append("Thank you for chatting with me! Here's your personalized summary:")
        response_parts.append("=" * 40)
        
        # Final recommendations
        sorted_scores = sorted(accumulated_scores.items(), key=lambda x: x[1], reverse=True)
        top_courses = [c for c in sorted_scores if c[1] > 0]
        
        if top_courses:
            response_parts.append("\n YOUR COURSE MATCHES:")
            for course, score in top_courses[:3]:  # Show top 3
                response_parts.append(f"\n{course.upper()}: {score:.1f}% match")
                response_parts.append(f"    {course_info[course]}")
        else:
            response_parts.append("\nKeep exploring different subjects to discover what you truly love!")
        
        response_parts.append("\nWishing you the very best in your career journey! 🌟")
        
        # Clear session after farewell
        del session_store[session_id]
        return {"response": "\n".join(response_parts), "new_session": True} # Indicate session end

    # Handle greetings
    if any(greeting in user_input.lower() for greeting in greetings):
        return {"response": get_greeting_response(), "new_session": False}

    # Process user input
    conversation_count += 1
    round_scores = predict_course(user_input)
    
    # Update accumulated scores with diminishing returns
    for course, score in round_scores.items():
        accumulated_scores[course] += score * (0.8 ** conversation_count)  # Reduce impact over time

    state["conversation_count"] = conversation_count
    state["accumulated_scores"] = accumulated_scores
    session_store[session_id] = state

    # Generate response based on conversation stage
    response_parts = []
    
    if conversation_count == 1:
        response_parts.append(f"Nice! {format_scores(accumulated_scores)}")
        response_parts.append(f"{random.choice(follow_up_questions)}")
    elif conversation_count <= 3:
        response_parts.append(f"Thanks for sharing! {format_scores(accumulated_scores)}")
        response_parts.append(f"{random.choice(follow_up_questions)}")
    else:
        response_parts.append(f"I'm getting a clearer picture! {format_scores(accumulated_scores)}")
        if max(accumulated_scores.values()) > 50:
            response_parts.append("Would you like me to provide more detailed information about any of these courses?")
        else:
            response_parts.append(f"{random.choice(follow_up_questions)}")
            
    return {"response": "\n\nChatbot: " + "\n\nChatbot: ".join(response_parts), "new_session": False}


# -------------------------------------------------------------------
# --- FLASK APPLICATION SETUP (NEW) ---
# -------------------------------------------------------------------



@app.route('/chat', methods=['POST'])
def chat_api():
    """API endpoint to receive user input and return chatbot response."""
    data = request.get_json()
    user_input = data.get('message', '').strip()
    
    # Use a basic session ID for continuity (e.g., in a React/JS frontend)
    session_id = request.headers.get('X-Session-ID', get_session_id(request)) 

    # Handle initial request state (e.g., if a new chat is started)
    if not user_input:
        return jsonify({
            "response": get_greeting_response(),
            "session_id": session_id,
            "status": "waiting_for_input"
        })

    # Get response from the core logic
    result = get_chatbot_response(user_input, session_id)
    
    return jsonify({
        "response": result["response"],
        "session_id": session_id,
        "status": "session_ended" if result["new_session"] else "active"
    })

# The original __main__ block is replaced to start the Flask server
if __name__ == "__main__":
    # The default port is 5000. You can change it to any available port, e.g., 8080.
    print("\nStarting Flask Chatbot Server...")
    print("Access the API at: http://127.0.0.1:5000/chat (POST method)")
    app.run(host='0.0.0.0', port=5000)
@app.route('/', methods=['GET'])
def home():
    return "<h1>Career Guidance Chatbot API</h1><p>Send a POST request to the /chat endpoint with a JSON body to start the conversation.</p>"