'use client'

import { useSupabase } from './SupabaseProvider'

export function SignedIn({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSupabase()
  
  if (loading) return null
  
  return user ? <>{children}</> : null
}

export function SignedOut({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSupabase()
  
  if (loading) return null
  
  return !user ? <>{children}</> : null
}