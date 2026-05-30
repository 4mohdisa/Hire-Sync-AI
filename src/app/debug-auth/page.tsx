import { getCurrentUser } from '@/services/supabase/auth'
import { createServerSupabaseClientForAuth } from '@/services/supabase/server'
import Link from 'next/link'

export default async function DebugAuth() {
  let authState = 'Unknown'
  let user = null
  let session = null
  let error = null
  
  try {
    const supabase = await createServerSupabaseClientForAuth()
    const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
    const { user: currentUser } = await getCurrentUser()
    
    session = currentSession
    user = currentUser
    error = sessionError
    
    if (currentUser && currentSession) {
      authState = 'Authenticated'
    } else if (currentSession && !currentUser) {
      authState = 'Session exists, but no user data'
    } else {
      authState = 'Not authenticated'
    }
  } catch (err) {
    error = err
    authState = 'Error occurred'
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Auth State: {authState}</h2>
        </div>
        
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Session Info:</h3>
          <pre className="text-xs overflow-auto">
            {session ? JSON.stringify(session, null, 2) : 'No session'}
          </pre>
        </div>
        
        <div className="bg-green-50 p-4 rounded">
          <h3 className="font-semibold mb-2">User Info:</h3>
          <pre className="text-xs overflow-auto">
            {user ? JSON.stringify(user, null, 2) : 'No user'}
          </pre>
        </div>
        
        {error ? (
          <div className="bg-red-50 p-4 rounded">
            <h3 className="font-semibold mb-2 text-red-700">Error:</h3>
            <pre className="text-xs overflow-auto text-red-600">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        ) : null}
        
        <div className="bg-yellow-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Troubleshooting Steps:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Clear browser cache and cookies for localhost</li>
            <li>Try signing out: <a href="/auth/sign-out" className="text-blue-600 underline">Sign Out</a></li>
            <li>Try signing in: <a href="/auth/sign-in" className="text-blue-600 underline">Sign In</a></li>
            <li>Visit settings: <a href="/user-settings/profile" className="text-blue-600 underline">Settings</a></li>
            <li>Go back to home: <Link href="/" className="text-blue-600 underline">Home</Link></li>
          </ol>
        </div>
      </div>
    </div>
  )
}