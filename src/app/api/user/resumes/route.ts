import { NextResponse } from 'next/server'
import { createServerSupabaseClientForAuth } from '@/services/supabase/server'
import { db } from '@/drizzle/db'
import { UserResumeTable } from '@/drizzle/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log("🔐 API /user/resumes: Starting authentication...")
    }
    
    // Use unified server auth function
    const supabase = await createServerSupabaseClientForAuth()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("API /user/resumes auth error:", error.message)
      }
      return NextResponse.json({ error: 'Authentication error - Please try signing in again' }, { status: 401 })
    }
    
    if (!user) {
      if (process.env.NODE_ENV === 'development') {
        console.error("API /user/resumes: No user session found")
      }
      return NextResponse.json({ error: 'Unauthorized - Please sign in to access your resumes' }, { status: 401 })
    }

    if (process.env.NODE_ENV === 'development') {
      console.log("✅ API /user/resumes auth success for user:", user.email)
    }


    // Get all user resumes, ordered by primary first, then by creation date
    const resumes = await db.query.UserResumeTable.findMany({
      where: eq(UserResumeTable.user_id, user.id),
      orderBy: [
        desc(UserResumeTable.is_primary), // Primary resumes first
        desc(UserResumeTable.created_at)  // Then by creation date
      ],
    })


    return NextResponse.json({
      success: true,
      resumes: resumes
    })

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("❌ API /user/resumes error:", error)
    }
    
    return NextResponse.json({
      error: 'Failed to fetch resumes - Please try again'
    }, { status: 500 })
  }
}