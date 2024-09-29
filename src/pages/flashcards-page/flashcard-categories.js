import React, { useState, useEffect } from 'react';
import { supabase } from '../../components/supabaseClient';
import NavigationBar from '../../components/NavigationBar/NavigationBar'; // Assuming NavigationBar is already implemented
import './flashcard-categories.css'; // Styling for your Analytics page

function FlashcardCategories({ user }) {
  const [sets, setSets] = useState([]); // To store flashcard sets with their flashcards
  const [allFlashcards, setAllFlashcards] = useState([]); // To store all flashcards (for "All" category)
  const [newSetName, setNewSetName] = useState(''); // For the new set input field
  const [isAddingSet, setIsAddingSet] = useState(false); // Show or hide the new set input

  // Fetch flashcard sets and flashcards for each set based on user_id
  useEffect(() => {
    const fetchSetsAndFlashcards = async () => {
      try {
        // Step 1: Fetch all sets for the user
        const { data: setsData, error: setsError } = await supabase
          .from('FlashcardSets')
          .select('set_id, name')
          .eq('user_id', user.id);

        if (setsError) {
          console.error('Error fetching flashcard sets:', setsError);
          return;
        }

        console.log('Fetched Sets:', setsData);

        // Step 2: For each set, fetch the flashcards that belong to that set
        const setsWithFlashcards = await Promise.all(
          setsData.map(async (set) => {
            const { data: flashcards, error: flashcardsError } = await supabase
              .from('Flashcards')
              .select('*')
              .eq('set_id', set.set_id)
              .eq('user_id', user.id);

            if (flashcardsError) {
              console.error('Error fetching flashcards:', flashcardsError);
              return { ...set, flashcards: [] }; // Return empty flashcards on error
            }

            return { ...set, flashcards }; // Combine set with its flashcards
          })
        );

        // Step 3: Fetch all flashcards for the "All" category
        const { data: allFlashcardsData, error: allFlashcardsError } =
          await supabase.from('Flashcards').select('*').eq('user_id', user.id);

        if (allFlashcardsError) {
          console.error('Error fetching all flashcards:', allFlashcardsError);
          return;
        }

        // Step 4: Update state with the fetched data
        setSets(setsWithFlashcards);
        setAllFlashcards(allFlashcardsData); // Store all flashcards for the "All" category
      } catch (error) {
        console.error('Error fetching sets and flashcards:', error);
      }
    };

    fetchSetsAndFlashcards(); // Call the function
  }, [user.id]);

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

    console.log('New Set Added:', data);

    // Update the sets in the UI with the new set
    const newSet = { set_id: data[0].set_id, name: newSetName, flashcards: [] };
    setSets((prevSets) => [...prevSets, newSet]); // Add the new set to the existing sets
    setNewSetName(''); // Clear the input field
    setIsAddingSet(false); // Hide the input form
  };

  return (
    <div className="page-container">
      <NavigationBar />
      <div className="analytics-container">
        <div className="greeting-container py-5">
          <h1 className="greeting-text">Study Sets</h1>
          <h2 className="text-white text-2xl mt-4">Choose a set to study!</h2>
        </div>

        {/* Special "All" flashcards card */}
        <div className="analytics-content">
          <div
            key="all-flashcards"
            className="category-card"
            onClick={() => console.log('All Flashcards:', allFlashcards)}
          >
            <h2>All Flashcards</h2>
            <p>Count: {allFlashcards.length}</p>
          </div>

          {/* Display each flashcard set with flashcard count */}
          {sets.length > 0 ? (
            sets.map((set) => (
              <div
                key={set.set_id}
                className="category-card"
                onClick={() =>
                  console.log('Flashcards in Set:', set.flashcards)
                }
              >
                <h2>{set.name}</h2>
                <p>Count: {set.flashcards.length}</p>
              </div>
            ))
          ) : (
            <p>No sets available</p>
          )}
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
