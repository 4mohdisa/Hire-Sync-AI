import { createServerSupabaseClient, supabaseAdmin } from './server'
import { User } from '@supabase/supabase-js'

export async function getCurrentUser(): Promise<{
  userId: string | null
  user: User | null
}> {
  try {
    const supabase = await createServerSupabaseClient() // Await the function call
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // Handle specific Supabase auth errors gracefully
    if (error) {
      // These are expected errors for anonymous users
      if (error.message?.includes('session_missing') || 
          error.message?.includes('Auth session missing') ||
          error.status === 400) {
        return { userId: null, user: null }
      }
      
      // Log unexpected errors
      console.error('Unexpected auth error:', error)
      return { userId: null, user: null }
    }
    
    return {
      userId: user?.id || null,
      user
    }
  } catch (error: any) {
    // Handle thrown errors gracefully
    if (error?.message?.includes('session_missing') || 
        error?.message?.includes('Auth session missing')) {
      return { userId: null, user: null }
    }
    
    console.error('Error in getCurrentUser:', error)
    return { userId: null, user: null }
  }
}

export async function requireAuth() {
  const { user } = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return { user, userId: user.id }
}

export async function getUserById(id: string) {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(id)
  
  if (error) {
    console.error('Error getting user by ID:', error)
    return null
  }
  
  return data.user
}

export async function createUser(email: string, password: string, metadata?: Record<string, any>) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata: metadata,
    email_confirm: true // Auto-confirm emails without sending confirmation
  })
  
  if (error) {
    console.error('Error creating user:', error)
    throw error
  }
  
  return data.user
}

// Compatibility functions for Clerk migration
export async function getCurrentOrganization() {
  const { user } = await getCurrentUser()
  
  if (!user) {
    return { userId: null, orgId: null }
  }
  
  // Treat user as their own organization for compatibility
  return { 
    userId: user.id, 
    orgId: user.id 
  }
}

export async function requireCurrentOrganization() {
  const result = await getCurrentOrganization()
  
  if (!result.userId) {
    throw new Error('Authentication required')
  }
  
  return result
}