import { createClient } from '@supabase/supabase-js';

// Replace these variables with your actual Supabase project URL and public API key
const SUPABASE_URL = "https://qcijvabqhjfxxsmpjwbs.supabase.co";
const SUPABASE_PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjaWp2YWJxaGpmeHhzbXBqd2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMDQxNjEsImV4cCI6MjA4ODc4MDE2MX0.VTDFBxm5IhUACdA-QNB-AJralYxgG4oBhnnDdc7zGrc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
