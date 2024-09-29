import React, { useState, useEffect, useCallback } from 'react';
import NavigationBar from '../../components/NavigationBar/NavigationBar'; // Corrected path
import './flashcards-page.css'; // Corrected path
import { supabase } from '../../components/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Modal from './editDeleteModal';

function FlashcardsPage({ user }) {
  const [flashcards, setFlashcards] = useState([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalFlashcards = flashcards.length;

  const handleFlip = useCallback(() => {
    setIsFlipped((prevIsFlipped) => !prevIsFlipped);
  }, []);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentFlashcardIndex((prevIndex) =>
      prevIndex === totalFlashcards - 1 ? 0 : prevIndex + 1
    );
  }, [totalFlashcards]);

  const handlePrevious = useCallback(() => {
    setIsFlipped(false);
    setCurrentFlashcardIndex((prevIndex) =>
      prevIndex === 0 ? totalFlashcards - 1 : prevIndex - 1
    );
  }, [totalFlashcards]);

  // Keydown event listener inside useEffect
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        handleNext();
      }
      if (event.key === 'ArrowLeft') {
        handlePrevious();
      }
      if (event.key === ' ') {
        handleFlip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Clean up event listener on component unmount or re-render
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext, handlePrevious, handleFlip]);

  const editCard = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from('Flashcards')
      .delete()
      .eq('flashcard_id', flashcards[currentFlashcardIndex].flashcard_id);

    if (error) {
      console.error('Error deleting flashcard:', error);
    } else {
      setIsModalOpen(false); // Close modal after successful deletion
      fetchFlashcards(); // Refetch the updated list of flashcards
    }
  };

  // Fetch flashcards on component mount
  const fetchFlashcards = useCallback(async () => {
    if (user && user.id) {
      const { data, error } = await supabase
        .from('Flashcards')
        .select('front, back, flashcard_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching flashcards:', error);
      } else {
        setFlashcards(data);
      }
    }
  }, [user]);

  // Fetch flashcards on component mount
  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

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
          <div className="flex w-full justify-center">
            <div className="mx-4"></div>
            <button
              onClick={editCard}
              className="bg-gray-500 text-white py-2 px-4 rounded"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          closeModal={closeModal}
          currentFlashcard={currentFlashcard}
          deleteCard={handleDelete}
          fetchFlashcards={fetchFlashcards}
        />
      )}
    </div>
  );
}

export default FlashcardsPage;
