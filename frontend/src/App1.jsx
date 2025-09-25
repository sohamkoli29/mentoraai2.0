// src/App.jsx
import React from "react";
import {  Router, Routes, Route } from "react-router-dom";
import App from "./App"; // your home page
import ChatbotPage from "./pages/ChatbotPage/ChatbotPage";

function App1() {
  return (
  
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Routes>
      
    
  );
}

export default App1;
