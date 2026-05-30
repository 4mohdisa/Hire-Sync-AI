import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { createServerSupabaseClientForAuth } from "../supabase/server"
import { upsertUserResume, getUserResumeCount } from "@/features/users/db/userResumes"

const f = createUploadthing()

export const customFileRouter = {
  resumeUploader: f(
    {
      pdf: {
        maxFileSize: "8MB",
        maxFileCount: 1,
      },
    }
  )
    .middleware(async () => {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log("🔐 UploadThing: Starting authentication...")
        }
        
        // Use unified server auth function
        const supabase = await createServerSupabaseClientForAuth()
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error("UploadThing auth error:", error.message)
          }
          throw new UploadThingError("Authentication error - Please try signing in again")
        }
        
        if (!user) {
          if (process.env.NODE_ENV === 'development') {
            console.error("UploadThing: No user session found")
          }
          throw new UploadThingError("Unauthorized - Please sign in to upload a resume")
        }

        if (process.env.NODE_ENV === 'development') {
          console.log("✅ UploadThing auth success for user:", user.email)
        }

        // Check resume limit (max 3 resumes per user)
        const resumeCount = await getUserResumeCount(user.id)
        if (resumeCount >= 3) {
          throw new UploadThingError("Resume limit reached. You can upload maximum 3 resumes. Please delete an existing resume first.")
        }

        if (process.env.NODE_ENV === 'development') {
          console.log(`📊 User has ${resumeCount}/3 resumes`)
        }

        return { userId: user.id }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("❌ UploadThing middleware error:", error)
        }
        
        if (error instanceof UploadThingError) {
          throw error
        }
        
        throw new UploadThingError("Authentication failed - Please try signing in again")
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const { userId } = metadata

        await upsertUserResume(userId, {
          url: file.url,
          file_name: file.name,
        })

        if (process.env.NODE_ENV === 'development') {
          console.log("UploadThing: Resume saved successfully for user:", userId)
        }
        
        return { 
          message: "Resume uploaded successfully",
          fileUrl: file.url 
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("UploadThing onUploadComplete error:", error)
        }
        
        // Return a more specific error message
        if (error instanceof Error) {
          throw new Error(`Failed to save resume: ${error.message}`)
        }
        
        throw new Error("Failed to process uploaded resume")
      }
    }),
} satisfies FileRouter

export type CustomFileRouter = typeof customFileRouter
