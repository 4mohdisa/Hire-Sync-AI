import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    // Debug: Log request details
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Sync-user API called')
      console.log('Request headers:', Object.fromEntries(request.headers.entries()))
    }

    // Handle empty request body gracefully
    let requestBody
    try {
      const text = await request.text()
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Request body text:', text)
      }
      
      if (!text.trim()) {
        console.error('❌ Empty request body received')
        return NextResponse.json({ error: 'Empty request body' }, { status: 400 })
      }
      requestBody = JSON.parse(text)
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError)
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }

    const { userId, email, name, imageUrl } = requestBody
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 Parsed user data:', { userId, email, name, imageUrl })
    }
    
    if (!userId || !email) {
      console.error('❌ Missing required fields:', { userId: !!userId, email: !!email })
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