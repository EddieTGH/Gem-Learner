import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../components/supabaseClient';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import './flashcard-categories.css';

function FlashcardCategories({ user }) {
  const [sets, setSets] = useState([]); // To store flashcard sets with their flashcards
  const [allFlashcards, setAllFlashcards] = useState([]); // To store all flashcards (for "All" category)
  const [newSetName, setNewSetName] = useState(''); // For the new set input field
  const [isAddingSet, setIsAddingSet] = useState(false); // Show or hide the new set input

  const navigate = useNavigate(); // Initialize the navigate function

  const fetchSetsAndFlashcards = useCallback(async () => {
    try {
      // Fetch all sets for the user
      const { data: setsData, error: setsError } = await supabase
        .from('FlashcardSets')
        .select('set_id, name')
        .eq('user_id', user.id);

      if (setsError) {
        console.error('Error fetching flashcard sets:', setsError);
        return;
      }

      // Fetch flashcards for each set
      const setsWithFlashcards = await Promise.all(
        setsData.map(async (set) => {
          const { data: flashcards, error: flashcardsError } = await supabase
            .from('Flashcards')
            .select('*')
            .eq('set_id', set.set_id)
            .eq('user_id', user.id);

          if (flashcardsError) {
            console.error('Error fetching flashcards:', flashcardsError);
            return { ...set, flashcards: [] };
          }

          return { ...set, flashcards };
        })
      );

      // Fetch all flashcards for the "All" category
      const { data: allFlashcardsData, error: allFlashcardsError } =
        await supabase.from('Flashcards').select('*').eq('user_id', user.id);

      if (allFlashcardsError) {
        console.error('Error fetching all flashcards:', allFlashcardsError);
        return;
      }

      setSets(setsWithFlashcards);
      setAllFlashcards(allFlashcardsData);
    } catch (error) {
      console.error('Error fetching sets and flashcards:', error);
    }
  }, [user.id]);

  useEffect(() => {
    fetchSetsAndFlashcards();
  }, [fetchSetsAndFlashcards]);

  // Function to handle adding a new set
  const handleAddSet = async () => {
    if (!newSetName.trim()) {
      alert('Set name cannot be empty!');
      return;
    }

    // Insert new set into the FlashcardSets table
    const { data, error } = await supabase
      .from('FlashcardSets')
      .insert([{ name: newSetName, user_id: user.id }])
      .select();

    if (error) {
      console.error('Error adding new set:', error);
      return;
    }

    // Update the sets in the UI with the new set
    const newSet = { set_id: data[0].set_id, name: newSetName, flashcards: [] };
    setSets((prevSets) => [...prevSets, newSet]); // Add the new set to the existing sets
    setNewSetName(''); // Clear the input field
    setIsAddingSet(false); // Hide the input form
  };

  // Function to navigate to FlashcardsPage with the flashcards
  const handleSetClick = (flashcards, setName) => {
    navigate('/flashcards-page', { state: { flashcards, setName } });
  };

  // Function to delete a set
  const handleDeleteSet = async (setId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this set? This will delete all cards in the set. This action cannot be undone.'
    );

    if (!confirmDelete) {
      return;
    }

    try {
      // Delete flashcards associated with the set
      const { error: deleteFlashcardsError } = await supabase
        .from('Flashcards')
        .delete()
        .eq('set_id', setId);

      if (deleteFlashcardsError) {
        console.error('Error deleting flashcards:', deleteFlashcardsError);
        return;
      }

      // Delete the set itself
      const { error: deleteSetError } = await supabase
        .from('FlashcardSets')
        .delete()
        .eq('set_id', setId);

      if (deleteSetError) {
        console.error('Error deleting flashcard set:', deleteSetError);
        return;
      }

      // Update the UI by removing the deleted set
      setSets((prevSets) => prevSets.filter((set) => set.set_id !== setId));
      // Update allFlashcards by removing flashcards from the deleted set
      setAllFlashcards((prevFlashcards) =>
        prevFlashcards.filter((flashcard) => flashcard.set_id !== setId)
      );
    } catch (error) {
      console.error('Error deleting set:', error);
    }
  };

  return (
    <div className="page-container">
      <NavigationBar />
      <div className="analytics-container">
        <div className="greeting-container py-5">
          <h1 className="greeting-text">Study Sets</h1>
          <h2 className="text-white text-2xl mt-4">Choose a set to study!</h2>
        </div>

        {/* Display each flashcard set with flashcard count */}
        <div className="analytics-content">
          {sets.length > 0 ? (
            sets.map((set) => (
              <div key={set.set_id} className="category-card">
                <div onClick={() => handleSetClick(set.flashcards, set.name)}>
                  <h2>{set.name}</h2>
                  <p>Count: {set.flashcards.length}</p>
                </div>
                <button
                  className="delete-button text-red-600"
                  onClick={() => handleDeleteSet(set.set_id)}
                >
                  Delete Set
                </button>
              </div>
            ))
          ) : (
            <p>No sets available</p>
          )}

          {/* Special "All" flashcards card */}
          <div
            key="all-flashcards"
            className="category-card"
            onClick={() => handleSetClick(allFlashcards, 'All Flashcards')}
          >
            <h2>All Flashcards</h2>
            <p>Count: {allFlashcards.length}</p>
          </div>
        </div>

        {/* Button to add a new set */}
        <div className="add-set-section mt-4">
          {!isAddingSet ? (
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={() => setIsAddingSet(true)}
            >
              Add New Set
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="New Set Name"
                value={newSetName}
                onChange={(e) => setNewSetName(e.target.value)}
                className="border border-gray-300 p-2 rounded"
              />
              <button
                className="bg-green-500 text-white py-2 px-4 rounded"
                onClick={handleAddSet}
              >
                Save
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => setIsAddingSet(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FlashcardCategories;
