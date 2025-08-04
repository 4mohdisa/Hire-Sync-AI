'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../client'

// Helper function to sync user via API call
async function ensureUserExistsInDatabase(authUser: User) {
  try {
    const response = await fetch('/api/auth/sync-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        imageUrl: authUser.user_metadata?.avatar_url || null,
      }),
    })
    
    if (!response.ok) {
      console.error('Failed to sync user to database')
    }
  } catch (error) {
    console.error('Error syncing user to database:', error)
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
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Sync existing user to database if they're logged in
      if (session?.user) {
        await ensureUserExistsInDatabase(session.user)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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