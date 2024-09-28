import React, { useState, useEffect } from 'react';
import { supabase } from '../../components/supabaseClient';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import './flashcards-page.css';

function FlashcardsPage({ user }) {
  // Accept user as a prop
  const [flashcards, setFlashcards] = useState([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch flashcards on component mount
  useEffect(() => {
    if (user && user.id) {
      // Ensure user is passed as a prop and has an id
      const fetchFlashcards = async () => {
        const { data, error } = await supabase
          .from('Flashcards')
          .select('front, back')
          .eq('user_id', user.id); // Use user.id from the prop

        if (error) {
          console.error('Error fetching flashcards:', error);
        } else {
          setFlashcards(data);
        }
        setLoading(false); // Stop loading once data is fetched
      };

      fetchFlashcards(); // Fetch flashcards for this user
    }
  }, [user]);

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

  if (loading) {
    return (
      <div className="flashcards-container">
        <NavigationBar />
        <div className="flashcard-content">
          <h1>Flashcards</h1>
          <p>Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (totalFlashcards === 0) {
    return (
      <div className="flashcards-container">
        <NavigationBar />
        <div className="flashcard-content">
          <h1>Flashcards</h1>
          <p>No flashcards available.</p>
        </div>
      </div>
    );
  }

  const currentFlashcard = flashcards[currentFlashcardIndex];

  return (
    <div className="flashcards-container">
      <NavigationBar />
      <div className="flashcard-content">
        <h1>Flashcards</h1>
        <div className="flashcard" onClick={handleFlip}>
          {isFlipped ? currentFlashcard.back : currentFlashcard.front}
        </div>
        <div className="navigation-buttons">
          <button onClick={handlePrevious}>&larr; Previous</button>
          <span>
            Flashcard {currentFlashcardIndex + 1} of {totalFlashcards}
          </span>
          <button onClick={handleNext}>Next &rarr;</button>
        </div>
      </div>
    </div>
  );
}

export default FlashcardsPage;
