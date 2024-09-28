import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/chat-page/chat-page";
import FlashcardsPage from "./pages/flashcards-page/flashcards-page";
import AnalyticsPage from "./pages/analytics-page/analytics-page";
import NavigationBar from "./components/NavigationBar/NavigationBar";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/chat-page" element={<ChatPage />} />
          <Route path="/flashcards-page" element={<FlashcardsPage />} />
          <Route path="/analytics-page" element={<AnalyticsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
