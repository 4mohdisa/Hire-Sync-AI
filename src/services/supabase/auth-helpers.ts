import { supabase } from './client'

export async function signUpWithoutConfirmation(email: string, password: string) {
  try {
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // No email redirect
        data: {
          email_confirm: false
        }
      }
    })

    if (error) {
      console.error('Sign up error:', error)
      return { success: false, error: error.message }
    }

    // If the user was created but needs confirmation, 
    // we'll try to sign them in directly (for development)
    if (data.user && !data.session) {
      console.log('User created but no session, attempting direct sign in...')
      
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) {
        console.error('Auto sign-in failed:', signInError)
        return { 
          success: false, 
          error: 'Account created but email confirmation required. Please check your email or contact support.'
        }
      }

      return { success: true, user: signInData.user, session: signInData.session }
    }

    return { success: true, user: data.user, session: data.session }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}