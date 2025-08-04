import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/services/supabase/server'
import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schema'

export async function GET() {
  try {
    console.log('Fetching debug info for users...')
    
    // Get all users from Supabase Auth
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (authError) {
      console.error('Error fetching auth users:', authError)
      return NextResponse.json({ error: 'Failed to fetch auth users' }, { status: 500 })
    }

    // Get all users from app's users table
    const appUsers = await db.select().from(UserTable)

    // Create comparison data
    const authUserEmails = authUsers.users.map(u => ({ id: u.id, email: u.email, created_at: u.created_at }))
    const appUserEmails = appUsers.map(u => ({ id: u.id, email: u.email, created_at: u.created_at }))
    
    // Find users in auth but not in app
    const orphanedAuthUsers = authUsers.users.filter(authUser => 
      !appUsers.some(appUser => appUser.id === authUser.id)
    ).map(u => ({ id: u.id, email: u.email, created_at: u.created_at }))
    
    // Find users in app but not in auth (shouldn't happen)
    const orphanedAppUsers = appUsers.filter(appUser => 
      !authUsers.users.some(authUser => authUser.id === appUser.id)
    ).map(u => ({ id: u.id, email: u.email, created_at: u.created_at }))

    return NextResponse.json({ 
      summary: {
        authUsersCount: authUsers.users.length,
        appUsersCount: appUsers.length,
        orphanedAuthUsersCount: orphanedAuthUsers.length,
        orphanedAppUsersCount: orphanedAppUsers.length
      },
      authUsers: authUserEmails,
      appUsers: appUserEmails,
      orphanedAuthUsers: orphanedAuthUsers.length > 0 ? orphanedAuthUsers : undefined,
      orphanedAppUsers: orphanedAppUsers.length > 0 ? orphanedAppUsers : undefined
    })
    
  } catch (error) {
    console.error('Error in debug users:', error)
    return NextResponse.json({ 
      error: 'Internal server error during debug' 
    }, { status: 500 })
  }
}