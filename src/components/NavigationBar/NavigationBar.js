import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavigationBar.css'; // Import the CSS file

function NavigationBar() {
  const navigate = useNavigate();

  const goToLogOut = async () => {
    navigate('/logout');
  };

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
        <li className="nav-item">
          <Link to="/rag-page" className="nav-link">
            Career Prep by Pitt
          </Link>
        </li>
      </ul>
      <div className="spacer"></div>
      <button className="sign-out-btn" onClick={goToLogOut}>
        Sign Out
      </button>
    </nav>
  );
}

export default NavigationBar;
