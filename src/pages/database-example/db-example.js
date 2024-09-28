import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const apiKey = process.env.REACT_APP_SUPABASE_API_KEY;
const supabase = createClient("https://nmanyvuklwcvvbkrhgwa.supabase.co/", apiKey);

function DbExample() {
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    getFlashcards();
  }, []);

  async function getFlashcards() {
    const { data } = await supabase.from("Flashcards").select();
    setFlashcards(data);
  }

  return (
    <ul>
      {flashcards.map((flashcard) => (
        <li key={flashcard.front}>{flashcard.front} and {flashcard.back}</li>
      ))}
    </ul>
  );
}

export default DbExample;