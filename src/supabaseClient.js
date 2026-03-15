import { createClient } from '@supabase/supabase-js';

// Replace these variables with your actual Supabase project URL and public API key
const SUPABASE_URL = "https://qcijvabqhjfxxsmpjwbs.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_FxmBsD7CxlTw5DiHMXOrnQ_jjirxeuF";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
