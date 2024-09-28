import { createClient } from '@supabase/supabase-js';

const apiKey = process.env.REACT_APP_SUPABASE_API_KEY;
const supabaseUrl = 'https://nmanyvuklwcvvbkrhgwa.supabase.co/';
const supabaseAnonKey = apiKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
