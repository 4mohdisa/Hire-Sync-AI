import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/services/supabase/auth'
import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url('Invalid URL format').optional().or(z.literal('')),
})

export async function PUT(request: NextRequest) {
  try {
    const { user } = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate the input
    const validatedData = updateProfileSchema.parse(body)
    
    // Convert empty strings to null for optional fields
    const updateData = {
      name: validatedData.name,
      phone: validatedData.phone || null,
      location: validatedData.location || null,
      website: validatedData.website || null,
      updated_at: new Date(),
    }

    // Update the user profile
    const updatedUser = await db
      .update(UserTable)
      .set(updateData)
      .where(eq(UserTable.id, user.id))
      .returning()

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser[0]
    })

  } catch (error) {
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { user } = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile from database
    const userProfile = await db.query.UserTable.findFirst({
      where: eq(UserTable.id, user.id)
    })

    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: userProfile
    })

  } catch {
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}