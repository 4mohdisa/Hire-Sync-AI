'use client'

import { useSupabase } from './SupabaseProvider'
import { ReactNode } from 'react'

export function SignedIn({ children }: { children: ReactNode }) {
  const { user, loading } = useSupabase()
  
  if (loading) return null
  if (!user) return null
  
  return <>{children}</>
}

export function SignedOut({ children }: { children: ReactNode }) {
  const { user, loading } = useSupabase()
  
  if (loading) return null
  if (user) return null
  
  return <>{children}</>
}