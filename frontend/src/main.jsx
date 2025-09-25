import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ import BrowserRouter
import App1 from './App1.jsx';
import './index.css';
import FloatingChatButton   from "./components/FloatingChatButton/FloatingChatButton";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App1 />
      <FloatingChatButton/>
    </BrowserRouter>
  </React.StrictMode>
);
