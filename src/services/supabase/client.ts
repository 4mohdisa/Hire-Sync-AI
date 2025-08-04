import { createClient } from '@supabase/supabase-js'
import { env } from '@/data/env/client'

// Client-side Supabase client (for components)
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Alternative client component helper (if needed)
export const createSupabaseClient = () => 
  createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )