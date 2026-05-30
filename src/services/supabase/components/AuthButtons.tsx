'use client'

import { Button } from "@/components/ui/button"
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from "next/navigation"
import { ComponentProps } from "react"
import React from "react"

export function SignUpButton({
  children,
  ...props
}: ComponentProps<typeof Button>) {
  const router = useRouter()
  
  const handleSignUp = () => {
    router.push('/auth/sign-up')
  }
  
  return (
    <Button onClick={handleSignUp} {...props}>
      {children || "Sign Up"}
    </Button>
  )
}

export function SignInButton({
  children,
  ...props
}: ComponentProps<typeof Button>) {
  const router = useRouter()
  
  const handleSignIn = () => {
    router.push('/auth/sign-in')
  }
  
  return (
    <Button onClick={handleSignIn} {...props}>
      {children || "Sign In"}
    </Button>
  )
}

interface SignOutButtonProps {
  children?: React.ReactNode
  asChild?: boolean
}

export function SignOutButton({
  children,
  asChild = false // eslint-disable-line @typescript-eslint/no-unused-vars
}: SignOutButtonProps) {
  const handleSignOut = async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔴 Starting sign out process...')
      }
      
      // Create SSR-compatible Supabase client
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Sign out error:', error)
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Sign out successful, reloading page...')
        }
        // Force reload to clear all state
        window.location.href = '/'
      }
    } catch (error) {
      console.error('❌ Unexpected sign out error:', error)
      // Still try to reload
      window.location.href = '/'
    }
  }
  
  // If children is provided, clone it and add the onClick handler
  if (children) {
    // Clone the children and add the onClick handler
    return React.cloneElement(
      children as React.ReactElement<{ onClick?: () => void }>, 
      {
        onClick: handleSignOut
      }
    )
  }
  
  // Default button if no children
  return (
    <Button onClick={handleSignOut}>
      Sign Out
    </Button>
  )
}