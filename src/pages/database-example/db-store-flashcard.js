import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Set up your Supabase client
const apiKey = process.env.REACT_APP_SUPABASE_API_KEY;
const supabase = createClient(
  'https://nmanyvuklwcvvbkrhgwa.supabase.co/',
  apiKey
);

async function storeFlashcard(front, back, userId, setName) {
  const set_id = setName.trim() === '' ? null : setName;
  const flashcard_id = uuidv4();
  const { error } = await supabase.from('Flashcards').insert([
    {
      flashcard_id: flashcard_id, // Chat session ID (UUID format)
      created_at: new Date(), // Timestamp for when the chat was created
      front: front, // User's query to the chatbot
      back: back, // Chatbot's response
      user_id: userId, // The user's ID (UUID format)
      set_id: set_id,
    },
  ]);

  if (error) {
    console.error('Error inserting flashcard into Supabase:', error.message);
  } else {
    console.log('Flashcard successfully stored in the database');
  }
}

export default storeFlashcard;
