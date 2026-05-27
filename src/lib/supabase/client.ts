import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create client even with empty credentials - the app will handle auth errors gracefully
export const supabase = createClient(supabaseUrl, supabaseKey)

// Log warning in development if credentials are missing
if (import.meta.env.DEV && (!supabaseUrl || !supabaseKey)) {
  console.warn('[v0] Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
}
