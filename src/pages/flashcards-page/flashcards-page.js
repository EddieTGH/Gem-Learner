import React, { useState, useEffect } from 'react';
import NavigationBar from '../../components/NavigationBar/NavigationBar'; // Corrected path
import './flashcards-page.css'; // Corrected path
import { supabase } from '../../components/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

function FlashcardsPage({ user }) {
  const [flashcards, setFlashcards] = useState([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Fetch flashcards on component mount
  useEffect(() => {
    if (user && user.id) {
      const fetchFlashcards = async () => {
        const { data, error } = await supabase
          .from('Flashcards')
          .select('front, back')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching flashcards:', error);
        } else {
          setFlashcards(data);
        }
      };

      fetchFlashcards();
    }
  }, [user]);

  // Greeting text animation
  useEffect(() => {
    const greetingText = document.querySelector('.greeting-text');
    if (greetingText) {
      greetingText.style.opacity = '1';
      greetingText.style.transform = 'translateY(0)';
    }
  }, []);

  const totalFlashcards = flashcards.length;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentFlashcardIndex((prevIndex) =>
      prevIndex === totalFlashcards - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentFlashcardIndex((prevIndex) =>
      prevIndex === 0 ? totalFlashcards - 1 : prevIndex - 1
    );
  };

  if (totalFlashcards === 0) {
    return (
      <div className="flashcards-container">
        <NavigationBar />
        <div className="main-content">
          <div className="greeting-container">
            <h1 className="greeting-text">Hello, {user?.email || 'Guest'}</h1>
            <p className="greeting-subtext">How can I help you today?</p>
          </div>
          <div className="flashcard-content">
            <h1>Flashcards</h1>
            <p>No flashcards available.</p>
          </div>
        </div>
      </div>
    );
  }

  const currentFlashcard = flashcards[currentFlashcardIndex];

  return (
    <div className="flashcards-container">
      <NavigationBar />
      <div className="main-content">
        <div className="greeting-container">
          <h1 className="greeting-text">Hello, {user?.email || 'Guest'}</h1>
          <p className="greeting-subtext">How can I help you today?</p>
        </div>
        <div className="flashcard-content">
          <h1>Flashcards</h1>
          <div
            className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}
            onClick={handleFlip}
          >
            <div className="flashcard-inner">
              <div className="flashcard-front">{currentFlashcard.front}</div>
              <div className="flashcard-back">{currentFlashcard.back}</div>
            </div>
          </div>
          <div className="navigation-buttons">
            <button className="navigation-button" onClick={handlePrevious}>
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="navigation-button-icon"
              />
              Previous
            </button>
            <span>
              {currentFlashcardIndex + 1} of {totalFlashcards}
            </span>
            <button className="navigation-button" onClick={handleNext}>
              Next
              <FontAwesomeIcon
                icon={faArrowRight}
                className="navigation-button-icon"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlashcardsPage;
