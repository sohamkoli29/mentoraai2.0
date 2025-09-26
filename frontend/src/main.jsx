import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ import BrowserRouter
import App from './App.jsx';
import './index.css';
import FloatingChatButton   from "./components/FloatingChatButton/FloatingChatButton";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <FloatingChatButton/>
    </BrowserRouter>
  </React.StrictMode>
);
