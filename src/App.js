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
        <Route path="/chat-page" element={<ChatBot />} />
        <Route
          path="/flashcards-page"
          element={<FlashcardsPage user={user} />}
        />
        {/* //         <NavigationBar />
//         <Routes>
//           <Route path="/chat-page" element={<ChatPage />} />
//           <Route path="/flashcards-page" element={<FlashcardsPage />} />
//           <Route path="/analytics-page" element={<AnalyticsPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
