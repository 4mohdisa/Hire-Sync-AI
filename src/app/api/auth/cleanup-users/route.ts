import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/services/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { userIds } = await request.json()
    
    if (!userIds || !Array.isArray(userIds)) {
      return NextResponse.json({ error: 'userIds array is required' }, { status: 400 })
    }

    console.log(`Cleaning up ${userIds.length} users from Supabase Auth...`)

    let deletedCount = 0
    const errors: string[] = []
    
    for (const userId of userIds) {
      try {
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
        
        if (error) {
          errors.push(`Failed to delete user ${userId}: ${error.message}`)
        } else {
          deletedCount++
          console.log(`Deleted user: ${userId}`)
        }
      } catch (err) {
        errors.push(`Exception deleting user ${userId}: ${err}`)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Cleanup complete: ${deletedCount} users deleted`,
      deletedCount,
      errors: errors.length > 0 ? errors : undefined
    })
    
  } catch (error) {
    console.error('Error in user cleanup:', error)
    return NextResponse.json({ 
      error: 'Internal server error during user cleanup' 
    }, { status: 500 })
  }
}