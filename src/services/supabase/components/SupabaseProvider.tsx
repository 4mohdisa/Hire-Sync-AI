'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

// Create the Supabase client for SSR - let it handle cookies automatically
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Helper function to sync user via API call
async function ensureUserExistsInDatabase(authUser: User) {
  try {
    const userData = {
      userId: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
      imageUrl: authUser.user_metadata?.avatar_url || null,
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Attempting to sync user:', userData)
    }

    const response = await fetch('/api/auth/sync-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📡 Sync response status:', response.status)
    }

    const result = await response.json()
    
    if (!response.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ User sync failed:', result.error)
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ User sync successful:', result.action)
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ User sync error:', error)
    }
  }
}

type SupabaseContext = {
  user: User | null
  session: Session | null
  loading: boolean
}

const Context = createContext<SupabaseContext>({
  user: null,
  session: null,
  loading: true,
})

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Sync existing user to database if they're logged in
      if (session?.user) {
        await ensureUserExistsInDatabase(session.user)
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Initial session loaded:', session?.user ? `User: ${session.user.email}` : 'No user')
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Auth state change:', event, session?.user ? `User: ${session.user.email}` : 'No user')
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Sync user to app's users table on sign in/up
        if (event === 'SIGNED_IN' && session?.user) {
          await ensureUserExistsInDatabase(session.user)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    user,
    session,
    loading,
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export const useSupabase = () => {
  return useContext(Context)
}