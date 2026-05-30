import { db } from "@/drizzle/db"
import { UserResumeTable } from "@/drizzle/schema"
import { revalidateUserResumeCache } from "./cache/userResumes"
import { eq, and } from "drizzle-orm"

export async function upsertUserResume(
  userId: string,
  data: Omit<typeof UserResumeTable.$inferInsert, "user_id">
) {
  try {
    // First, set all existing resumes for this user to non-primary
    await db
      .update(UserResumeTable)
      .set({ is_primary: false })
      .where(eq(UserResumeTable.user_id, userId))
    
    // Then insert the new resume as primary
    const result = await db
      .insert(UserResumeTable)
      .values({ 
        user_id: userId, 
        ...data,
        is_primary: true
      })
      .returning()

    if (process.env.NODE_ENV === 'development') {
      console.log("Resume upsert successful for user:", userId)
    }
    
    revalidateUserResumeCache(userId)
    return result[0]
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error upserting resume:", error)
    }
    throw error
  }
}

export async function updateUserResume(
  userId: string,
  data: Partial<Omit<typeof UserResumeTable.$inferInsert, "user_id">>
) {
  await db
    .update(UserResumeTable)
    .set(data)
    .where(eq(UserResumeTable.user_id, userId))

  revalidateUserResumeCache(userId)
}

export async function deleteUserResume(userId: string, resumeId: string) {
  try {
    // Delete the resume
    const deletedResume = await db
      .delete(UserResumeTable)
      .where(
        and(
          eq(UserResumeTable.id, resumeId),
          eq(UserResumeTable.user_id, userId) // Ensure user owns the resume
        )
      )
      .returning()

    if (process.env.NODE_ENV === 'development') {
      console.log("Resume deleted for user:", userId)
    }
    
    revalidateUserResumeCache(userId)
    return deletedResume[0]
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error deleting resume:", error)
    }
    throw error
  }
}

export async function setUserResumePrimary(userId: string, resumeId: string) {
  try {
    // First, set all resumes for this user to non-primary
    await db
      .update(UserResumeTable)
      .set({ is_primary: false })
      .where(eq(UserResumeTable.user_id, userId))

    // Then set the specified resume as primary
    const updatedResume = await db
      .update(UserResumeTable)
      .set({ is_primary: true })
      .where(
        and(
          eq(UserResumeTable.id, resumeId),
          eq(UserResumeTable.user_id, userId) // Ensure user owns the resume
        )
      )
      .returning()

    if (process.env.NODE_ENV === 'development') {
      console.log("Primary resume updated for user:", userId)
    }
    
    revalidateUserResumeCache(userId)
    return updatedResume[0]
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error setting primary resume:", error)
    }
    throw error
  }
}

export async function getUserResumeCount(userId: string): Promise<number> {
  const resumes = await db.query.UserResumeTable.findMany({
    where: eq(UserResumeTable.user_id, userId),
  })
  return resumes.length
}
