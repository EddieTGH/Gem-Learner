import React from "react";
import { Link } from "react-router-dom";
import "./NavigationBar.css"; // Import the CSS file

function NavigationBar() {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/analytics-page" className="nav-link">
            Analytics
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/flashcards-page" className="nav-link">
            Flashcards
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/chat-page" className="nav-link">
            Chat
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavigationBar;
