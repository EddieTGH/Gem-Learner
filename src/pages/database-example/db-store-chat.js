import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Set up your Supabase client
const apiKey = process.env.REACT_APP_SUPABASE_API_KEY;
const supabase = createClient(
  'https://nmanyvuklwcvvbkrhgwa.supabase.co/',
  apiKey
);

// Function to store chat in the Supabase database
async function storeChat(query, response, category, userId, isFlashcard) {
  const chatId = uuidv4();
  const { error } = await supabase.from('Chats').insert([
    {
      chat_id: chatId, // Chat session ID (UUID format)
      created_at: new Date(), // Timestamp for when the chat was created
      query: query, // User's query to the chatbot
      response: response, // Chatbot's response
      category: category, // Category of the chat (optional, can be null)
      is_flashcard: isFlashcard, // Boolean indicating if it's a flashcard-related chat
      user_id: userId, // The user's ID (UUID format)
    },
  ]);

  if (error) {
    console.error('Error inserting chat into Supabase:', error.message);
  } else {
    console.log('Chat successfully stored in the database');
  }
}

export default storeChat;
