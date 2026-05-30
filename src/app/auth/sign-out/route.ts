import { createServerSupabaseClientForAuth } from '@/services/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    console.log('🔄 Processing sign out request...');
    
    const supabase = await createServerSupabaseClientForAuth()
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('❌ Sign out error:', error)
    } else {
      console.log('✅ Successfully signed out from Supabase')
    }
    
    // Clear all authentication cookies
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    
    for (const cookie of allCookies) {
      if (cookie.name.includes('auth') || cookie.name.includes('supabase')) {
        console.log(`🍪 Clearing cookie: ${cookie.name}`)
        cookieStore.delete(cookie.name)
      }
    }
    
    // Clear all cached data
    revalidatePath('/', 'layout')
    revalidatePath('/auth', 'layout')
    revalidatePath('/user-settings', 'layout')
    revalidatePath('/employer', 'layout')
    
    console.log('✅ Cleared all caches and cookies')
    
  } catch (error) {
    console.error('❌ Error during sign out:', error)
  }
  
  // Always redirect to home page
  redirect('/')
}