import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { getCurrentUser } from "../supabase/auth"
import { upsertUserResume } from "@/features/users/db/userResumes"
import { db } from "@/drizzle/db"
import { eq } from "drizzle-orm"
import { UserResumeTable } from "@/drizzle/schema"
import { uploadthing } from "./client"

const f = createUploadthing()

export const customFileRouter = {
  resumeUploader: f(
    {
      pdf: {
        maxFileSize: "8MB",
        maxFileCount: 1,
      },
    },
    { awaitServerData: true }
  )
    .middleware(async () => {
      const { userId } = await getCurrentUser()
      if (userId == null) throw new UploadThingError("Unauthorized")

      return { userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { userId } = metadata
      const resumeFileKey = await getUserResumeFileKey(userId)

      await upsertUserResume(userId, {
        resumeFileUrl: file.ufsUrl,
        resumeFileKey: file.key,
      })

      if (resumeFileKey != null) {
        await uploadthing.deleteFiles(resumeFileKey)
      }

      // TODO: Add direct AI resume processing here if needed
      
      return { message: "Resume uploaded successfully" }
    }),
} satisfies FileRouter

export type CustomFileRouter = typeof customFileRouter

async function getUserResumeFileKey(userId: string) {
  const data = await db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.user_id, userId), // Use snake_case
    columns: {
      resume_file_key: true, // Use snake_case
    },
  })

  return data?.resume_file_key
}
