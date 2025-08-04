'use client'

import { useSupabase } from "@/services/supabase/components/SupabaseProvider"
import { supabase } from "@/services/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DebugAuthPage() {
  const { user, session, loading } = useSupabase()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      // Clear the session completely
      await supabase.auth.signOut({ scope: 'global' })
      
      // Clear all browser storage
      localStorage.clear()
      sessionStorage.clear()
      
      // Clear any Supabase-specific storage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.auth.token') || key.startsWith('sb-')) {
          localStorage.removeItem(key)
        }
      })
      
      // Clear cookies by setting them to expire
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Force page refresh to clear any cached state
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    } catch (error) {
      console.error('Sign out error:', error)
      setIsSigningOut(false)
    }
  }

  const goToSignIn = () => {
    router.push('/auth/sign-in')
  }

  const handleDeleteAccount = async () => {
    if (!user || !confirm('Are you sure you want to delete this account? This cannot be undone.')) {
      return
    }
    
    try {
      // Note: Deleting user from Supabase requires admin privileges
      // For now, just sign out - we'll implement admin deletion if needed
      alert('Account deletion requires admin access. For now, signing out...')
      await handleSignOut()
    } catch (error) {
      console.error('Delete account error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Authentication Debug</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded">
            <h2 className="font-semibold mb-2">Current Status:</h2>
            <p><strong>User:</strong> {user ? user.email : 'Not signed in'}</p>
            <p><strong>Session:</strong> {session ? 'Active' : 'None'}</p>
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          </div>

          {user ? (
            <div className="space-y-2">
              <p className="text-sm text-red-600">
                You are signed in as <strong>{user.email}</strong>. This is why you're being redirected away from auth pages.
              </p>
              <Button 
                onClick={handleSignOut} 
                className="w-full" 
                variant="destructive"
                disabled={isSigningOut}
              >
                {isSigningOut ? 'Signing Out...' : 'Sign Out & Clear Session'}
              </Button>
              <Button 
                onClick={handleDeleteAccount} 
                className="w-full" 
                variant="outline"
                size="sm"
              >
                Delete Account (if needed)
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-green-600">
                No active session. You should be able to access auth pages.
              </p>
              <Button onClick={goToSignIn} className="w-full">
                Go to Sign In Page
              </Button>
            </div>
          )}
          
          <Button 
            onClick={() => router.push('/')} 
            variant="outline" 
            className="w-full"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}