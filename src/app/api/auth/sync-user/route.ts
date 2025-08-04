import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const { userId, email, name, imageUrl } = await request.json()
    
    if (!userId || !email) {
      return NextResponse.json({ error: 'userId and email are required' }, { status: 400 })
    }

    // Check if user already exists in app's users table
    const existingUser = await db.query.UserTable.findFirst({
      where: eq(UserTable.id, userId)
    })
    
    if (!existingUser) {
      // Create user in app's users table
      await db.insert(UserTable).values({
        id: userId,
        email: email,
        name: name || email.split('@')[0] || 'User',
        image_url: imageUrl || null,
      })
      
      return NextResponse.json({ 
        success: true, 
        message: 'User synced to database',
        action: 'created'
      })
    } else {
      return NextResponse.json({ 
        success: true, 
        message: 'User already exists in database',
        action: 'existed'
      })
    }
    
  } catch (error) {
    console.error('Error syncing user to database:', error)
    return NextResponse.json({ 
      error: 'Internal server error during user sync' 
    }, { status: 500 })
  }
}