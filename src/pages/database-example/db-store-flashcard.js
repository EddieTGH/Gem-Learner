import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from 'uuid';


// Set up your Supabase client
const apiKey = process.env.REACT_APP_SUPABASE_API_KEY;
const supabase = createClient("https://nmanyvuklwcvvbkrhgwa.supabase.co/", apiKey);

// Function to store chat in the Supabase database
async function storeFlashcard(front, back, userId) {
    const flashcard_id = uuidv4();
    const { error } = await supabase
    .from("Flashcards")
    .insert([
      {
        flashcard_id: flashcard_id,    // Chat session ID (UUID format)
        created_at: new Date(),       // Timestamp for when the chat was created
        front: front,                 // User's query to the chatbot
        back: back,                   // Chatbot's response
        user_id: userId              // The user's ID (UUID format)
      }
    ]);

  if (error) {
    console.error("Error inserting flashcard into Supabase:", error.message);
  } else {
    console.log("Flashcard successfully stored in the database");
  }
}

export default storeFlashcard;

// // Example usage:
// // Let's say you get the following data from the chatbot interaction:
// const query = "What is the capital of France?";
// const response = "The capital of France is Paris.";
// const category = "Geography";   // Optional
// const userId = "some-user-uuid"; // You can fetch or create this when the user logs in
// const chatId = "some-chat-uuid"; // Unique ID for each chat session
// const isFlashcard = false;       // Whether this chat is related to flashcards

// // Call the function to store the chat
// storeChat(query, response, category, userId, chatId, isFlashcard);
