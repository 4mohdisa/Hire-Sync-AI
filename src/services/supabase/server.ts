import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Environment variables with fallbacks
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://niyfuskcfxorcjwixzof.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5peWZ1c2tjZnhvcmNqd2l4em9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTk1MDMsImV4cCI6MjA2OTI3NTUwM30.9o8nNKVNhEqwXaF5m5J_0zyzIX50KMCsUxmoLtjoUhs'
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY || SUPABASE_ANON_KEY

// Admin client for server-side operations (uses service role key)
export const supabaseAdmin = createServerClient(
  SUPABASE_URL,
  SERVICE_ROLE_KEY,
  {
    cookies: {
      get: () => undefined,
      set: () => {},
      remove: () => {},
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  }
)

// User client for server-side user authentication (uses anon key)
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies() // Await the cookies() function for Next.js 15 compatibility
  
  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY, // Use anon key for user authentication
    {
      cookies: {
        get: (name: string) => {
          const value = cookieStore.get(name)?.value
          return value
        },
        set: (name: string, value: string, options: Record<string, unknown>) => {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Server components can't set cookies, ignore
          }
        },
        remove: (name: string, options: Record<string, unknown>) => {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // Server components can't remove cookies, ignore
          }
        },
      },
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    }
  )
}

// Unified server authentication function for API routes and middleware
export const createServerSupabaseClientForAuth = async () => {
  const cookieStore = await cookies()
  
  if (process.env.NODE_ENV === 'development') {
    const allCookies = cookieStore.getAll()
    console.log('Available cookies for auth:', allCookies.filter(c => 
      c.name.includes('supabase') || c.name.includes('sb-')
    ).map(c => c.name))
  }
  
  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name: string) => {
          const value = cookieStore.get(name)?.value
          if (process.env.NODE_ENV === 'development' && name.includes('supabase')) {
            console.log(`Auth cookie read - ${name}: ${value ? 'found' : 'missing'}`)
          }
          return value
        },
        set: () => {}, // No-op for server
        remove: () => {}, // No-op for server
      },
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    }
  )
}