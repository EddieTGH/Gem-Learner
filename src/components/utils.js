import { supabase } from '../components/supabaseClient';

// Function to fetch flashcard sets from Supabase
export const fetchFlashcardSets = async (user) => {
  console.log('HERE2222', user.id);
  try {
    const { data, error } = await supabase
      .from('FlashcardSets')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching flashcard sets:', error);
      return [];
    }

    return data; // Return fetched flashcard sets
  } catch (error) {
    console.error('Error fetching flashcard sets:', error);
    return [];
  }
};
