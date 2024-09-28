import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import ChatPage from "./pages/chat-page/chat-page";
import FlashcardsPage from "./pages/flashcards-page/flashcards-page";
// import AnalyticsPage from "./pages/analytics-page/analytics-page";
// import NavigationBar from "./components/NavigationBar/NavigationBar";
import Auth from "./pages/supabase-login/supabase-login";
import Dashboard from "./pages/dashboard-page/dashboard";
import { useState, useEffect } from "react";
import { supabase } from "./components/supabaseClient";
import "./App.css";
import ChatBot from "./pages/chat-page/chat-page";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function initializeChat() {
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: "Hello" }] },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });
  return chat;
}

function App() {
  const [user, setUser] = useState(null);
  const [chat, setChat] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    checkSession();
  }, []);

  useEffect(() => {
    async function init() {
      const chatObj = await initializeChat();
      setChat(chatObj);
    }
    init();
  }, []);

  return (
    <Router>
      <Routes>
        {/* If user is logged in, redirect to /dashboard, otherwise show Auth component */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <Auth setUser={setUser} />
          }
        />
        {/* If user is logged in, show Dashboard, otherwise redirect to / */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/chat-page" element={<ChatBot chat={chat} />} />
        <Route path="/flashcards-page" element={<FlashcardsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
