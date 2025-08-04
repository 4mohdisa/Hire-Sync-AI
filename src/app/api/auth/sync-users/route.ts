import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/services/supabase/server'
import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function POST() {
  try {
    console.log('Starting user sync process...')
    
    // Get all users from Supabase Auth
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (authError) {
      console.error('Error fetching auth users:', authError)
      return NextResponse.json({ error: 'Failed to fetch auth users' }, { status: 500 })
    }

    console.log(`Found ${authUsers.users.length} users in Supabase Auth`)

    // Sync each auth user to app's users table
    let syncedCount = 0
    let existingCount = 0
    
    for (const authUser of authUsers.users) {
      // Check if user already exists in app's users table
      const existingUser = await db.query.UserTable.findFirst({
        where: eq(UserTable.id, authUser.id)
      })
      
      if (!existingUser) {
        // Create user in app's users table
        await db.insert(UserTable).values({
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          image_url: authUser.user_metadata?.avatar_url || null,
        })
        syncedCount++
        console.log(`Synced user: ${authUser.email}`)
      } else {
        existingCount++
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Sync complete: ${syncedCount} users synced, ${existingCount} already existed`,
      syncedCount,
      existingCount,
      totalAuthUsers: authUsers.users.length
    })
    
  } catch (error) {
    console.error('Error in user sync:', error)
    return NextResponse.json({ 
      error: 'Internal server error during user sync' 
    }, { status: 500 })
  }
}