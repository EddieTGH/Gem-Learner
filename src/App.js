import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import FlashcardsPage from './pages/flashcards-page/flashcards-page';
import Auth from './pages/supabase-login/supabase-login';
import Dashboard from './pages/dashboard-page/dashboard';
import { supabase } from './components/supabaseClient';
import ChatBot from './pages/chat-page/chat-page';
import AnalyticsPage from './pages/analytics-page/analytics-page'; // Import AnalyticsPage
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    checkSession();
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
        {/* Route for ChatBot Page */}
        <Route path="/chat-page" element={<ChatBot user={user} />} />
        {/* Route for Flashcards Page */}
        <Route
          path="/flashcards-page"
          element={<FlashcardsPage user={user} />}
        />
        {/* Route for Analytics Page */}
        <Route
          path="/analytics-page"
          element={user ? <AnalyticsPage user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
