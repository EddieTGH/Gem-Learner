import React from 'react';
import { supabase } from '../../components/supabaseClient';

function Modal({ closeModal, currentFlashcard, deleteCard, fetchFlashcards }) {
  const changeFlashcard = async () => {
    console.log('first', currentFlashcard.flashcard_id);
    const { error } = await supabase
      .from('Flashcards')
      .update({
        front: document.querySelector('textarea').value,
        back: document.querySelectorAll('textarea')[1].value,
      })
      .eq('flashcard_id', currentFlashcard.flashcard_id);

    if (error) {
      console.error('Error updating flashcard:', error);
    } else {
      await fetchFlashcards();
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Flashcard</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Front</label>
          <textarea
            className="w-full border border-gray-300 p-2 rounded"
            defaultValue={currentFlashcard.front}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Back</label>
          <textarea
            className="w-full h-48 border border-gray-300 p-4 rounded"
            defaultValue={currentFlashcard.back}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-300 text-black py-2 px-4 rounded"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded"
            onClick={deleteCard}
          >
            Delete
          </button>
          <button
            onClick={changeFlashcard}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
