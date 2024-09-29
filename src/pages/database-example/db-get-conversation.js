import { createClient } from '@supabase/supabase-js';

// Set up your Supabase client
const apiKey = process.env.REACT_APP_SUPABASE_API_KEY;
const supabase = createClient(
	'https://nmanyvuklwcvvbkrhgwa.supabase.co/',
	apiKey
);

// Function to get convo from the Supabase database, if a convo with that conv_id exists
async function getConvo(convoId) {
	try {
		var { data, error } = await supabase
			.from('Conversations')
			.select('conversation')
			.eq('conv_id', convoId)
			.single();

		if (error) {
			console.log(`Error fetching conversation: ${error.message}`);
			return null;
		}

		return data?.conversation; // Return the JSONB object if found, otherwise null
	} catch (error) {
		console.log(error);
		return null;
	}
}

export default getConvo;