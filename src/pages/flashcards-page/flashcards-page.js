import React, { useState } from 'react';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import './flashcards-page.css';

const dummyFlashcards = [
  {
    question: 'What is React?',
    answer: 'A JavaScript library for building user interfaces.',
  },
  {
    question: 'What is JSX?',
    answer:
      'A syntax extension for JavaScript that looks similar to XML or HTML.',
  },
  {
    question: 'What is a component?',
    answer: 'A reusable piece of UI in React.',
  },
  {
    question: 'What is a hook?',
    answer:
      'A special function that lets you use state and other React features.',
  },
  {
    question: 'What is the useState hook?',
    answer: 'A hook that allows you to add state to a functional component.',
  },
  {
    question: 'What is the useEffect hook?',
    answer: 'A hook that lets you perform side effects in function components.',
  },
  {
    question: 'What is Virtual DOM?',
    answer: 'A representation of the real DOM that React uses for performance.',
  },
  {
    question: 'What is props?',
    answer:
      'Arguments passed into React components, used to customize the component.',
  },
  {
    question: 'What is state?',
    answer:
      'A built-in object used to store data that may change over the lifecycle of the component.',
  },
  {
    question: 'What is React Router?',
    answer: 'A library for managing navigation in React applications.',
  },
];

function FlashcardsPage() {
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const totalFlashcards = dummyFlashcards.length;

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

  const currentFlashcard = dummyFlashcards[currentFlashcardIndex];

  return (
    <div className="flashcards-container">
      <NavigationBar />
      <div className="flashcard-content">
        <h1>Flashcards</h1>
        <div className="flashcard" onClick={handleFlip}>
          {isFlipped ? currentFlashcard.answer : currentFlashcard.question}
        </div>
        <div className="navigation-buttons">
          <button onClick={handlePrevious}>← Previous</button>
          <span>
            Flashcard {currentFlashcardIndex + 1} of {totalFlashcards}
          </span>
          <button onClick={handleNext}>Next →</button>
        </div>
      </div>
    </div>
  );
}

export default FlashcardsPage;
