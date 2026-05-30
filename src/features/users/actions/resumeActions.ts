"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/services/supabase/auth"
import { deleteUserResume, setUserResumePrimary } from "../db/userResumes"

export async function deleteResumeAction(resumeId: string) {
  try {
    const { userId } = await getCurrentUser()
    
    if (!userId) {
      throw new Error("Authentication required")
    }

    await deleteUserResume(userId, resumeId)
    
    // Revalidate the resume page
    revalidatePath("/user-settings/resume")
    
    return { success: true, message: "Resume deleted successfully" }
  } catch (error) {
    console.error("Delete resume action error:", error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to delete resume" 
    }
  }
}

export async function setPrimaryResumeAction(resumeId: string) {
  try {
    const { userId } = await getCurrentUser()
    
    if (!userId) {
      throw new Error("Authentication required")
    }

    await setUserResumePrimary(userId, resumeId)
    
    // Revalidate the resume page
    revalidatePath("/user-settings/resume")
    
    return { success: true, message: "Primary resume updated successfully" }
  } catch (error) {
    console.error("Set primary resume action error:", error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to update primary resume" 
    }
  }
}