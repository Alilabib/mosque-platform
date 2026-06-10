import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://axuvnigmzqtvkvbkrrml.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dXZuaWdtenF0dmt2Ymtycm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMTE4ODAsImV4cCI6MjA5NjY4Nzg4MH0.r_2533743Dmfv-qLmo0kuPUxS4BZQklp9HZ8KOMLXrU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
