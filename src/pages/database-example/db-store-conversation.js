import { createClient } from '@supabase/supabase-js';

const apiKey = process.env.REACT_APP_SUPABASE_API_KEY;
const supabase = createClient(
  'https://nmanyvuklwcvvbkrhgwa.supabase.co/',
  apiKey
);

async function storeConvo(id, message, category, userId, role) {
  try {
    const convoContent = message;
    const { error } = await supabase.from('Conversations').upsert(
      {
        conv_id: id,
        created_at: new Date(),
        conversation: convoContent,
        user_id: userId,
      },
      { returning: 'minimal' }
    );

    if (error) {
      console.error('Error inserting convo history:', error);
    } else {
      console.log('Convo history inserted successfully');
    }
  } catch (error) {
    console.error('Error inserting convo history:', error);
  }
}

export default storeConvo;
