import { createClient } from '@supabase/supabase-js';

// Getting Supabase URL and Key from .env variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

// Creating the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
