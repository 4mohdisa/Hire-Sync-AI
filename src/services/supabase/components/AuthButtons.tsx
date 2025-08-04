'use client'

import { Button } from "@/components/ui/button"
import { supabase } from "../client"
import { useRouter } from "next/navigation"
import { ComponentProps } from "react"
import React from "react"

export function SignUpButton({
  children = <Button>Sign Up</Button>,
  ...props
}: ComponentProps<typeof Button>) {
  const router = useRouter()
  
  const handleSignUp = () => {
    router.push('/auth/sign-up')
  }
  
  return (
    <Button onClick={handleSignUp} {...props}>
      {children}
    </Button>
  )
}

export function SignInButton({
  children = <Button>Sign In</Button>,
  ...props
}: ComponentProps<typeof Button>) {
  const router = useRouter()
  
  const handleSignIn = () => {
    router.push('/auth/sign-in')
  }
  
  return (
    <Button onClick={handleSignIn} {...props}>
      {children}
    </Button>
  )
}

interface SignOutButtonProps extends ComponentProps<typeof Button> {
  children?: React.ReactNode
}

export function SignOutButton({
  children,
  ...props
}: SignOutButtonProps) {
  const router = useRouter()
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }
  
  // If children is provided, render as-is with click handler
  if (children) {
    return (
      <div onClick={handleSignOut} {...props}>
        {children}
      </div>
    )
  }
  
  // Default button if no children
  return (
    <Button onClick={handleSignOut} {...props}>
      Sign Out
    </Button>
  )
}