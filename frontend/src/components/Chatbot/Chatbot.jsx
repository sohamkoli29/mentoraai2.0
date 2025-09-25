import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm your career guidance assistant. Tell me about your interests, skills, or career goals!" }
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("default_user_session");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Show user's message
    const userMessage = input;
    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/chat",
        { message: userMessage },
        { 
          headers: { 
            "Content-Type": "application/json", 
            "X-Session-ID": sessionId 
          } 
        }
      );

      const botMessage = res.data.response;
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: "bot", text: botMessage }]);
        setIsTyping(false);
        setSessionId(res.data.session_id);
      }, 1000); // Simulate typing delay

    } catch (error) {
      console.error("Error sending message:", error);
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: "bot", 
          text: "Sorry, I'm having trouble connecting right now. Please try again!" 
        }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "calc(100vh - 120px)",
      backgroundColor: "white",
      fontFamily: "Arial, sans-serif"
    }}>
      
      {/* Messages Container */}
      <div style={{
        flex: 1,
        padding: "20px",
        overflowY: "auto",
        backgroundColor: "#fafafa",
        borderTop: "1px solid #e0e0e0"
      }}>
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            style={{
              display: "flex",
              justifyContent: msg.sender === "bot" ? "flex-start" : "flex-end",
              marginBottom: "15px"
            }}
          >
            <div style={{
              maxWidth: "70%",
              padding: "12px 16px",
              borderRadius: msg.sender === "bot" ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
              backgroundColor: msg.sender === "bot" ? "#e3f2fd" : "#2196f3",
              color: msg.sender === "bot" ? "#1565c0" : "white",
              wordBreak: "break-word",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              position: "relative"
            }}>
              {msg.sender === "bot" && (
                <div style={{
                  fontSize: "11px",
                  opacity: 0.7,
                  marginBottom: "4px",
                  fontWeight: "500"
                }}>
                  Career Assistant
                </div>
              )}
              <div style={{ 
                fontSize: "14px", 
                lineHeight: "1.4",
                  whiteSpace: "pre-line"   
              }}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: "15px"
          }}>
            <div style={{
              padding: "12px 16px",
              borderRadius: "18px 18px 18px 4px",
              backgroundColor: "#e3f2fd",
              color: "#1565c0"
            }}>
              <div style={{ fontSize: "11px", opacity: 0.7, marginBottom: "4px" }}>
                Career Assistant
              </div>
              <div style={{ fontSize: "14px" }}>
                <span>●</span>
                <span style={{ animationDelay: "0.2s" }}>●</span>
                <span style={{ animationDelay: "0.4s" }}>●</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div style={{
        padding: "20px",
        backgroundColor: "white",
        borderTop: "1px solid #e0e0e0",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.05)"
      }}>
        <div style={{
          display: "flex",
          gap: "10px",
          alignItems: "flex-end",
          maxWidth: "100%"
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about career paths, skills, education, job markets...      (type 'bye' to end session)"
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "25px",
              border: "2px solid #e0e0e0",
              fontSize: "14px",
              resize: "none",
              minHeight: "20px",
              maxHeight: "100px",
              fontFamily: "Arial, sans-serif",
              outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={e => e.target.style.borderColor = "#2196f3"}
            onBlur={e => e.target.style.borderColor = "#e0e0e0"}
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            style={{
              padding: "12px 20px",
              borderRadius: "25px",
              border: "none",
              backgroundColor: input.trim() && !isTyping ? "#2196f3" : "#ccc",
              color: "white",
              fontSize: "14px",
              fontWeight: "500",
              cursor: input.trim() && !isTyping ? "pointer" : "not-allowed",
              transition: "background-color 0.2s",
              minWidth: "60px"
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;