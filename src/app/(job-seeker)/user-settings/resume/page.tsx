import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Suspense } from "react"
import { DropzoneClient } from "./_DropzoneClient"
import { getCurrentUser } from "@/services/supabase/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUserResumeIdTag } from "@/features/users/db/cache/userResumes"
import { db } from "@/drizzle/db"
import { UserResumeTable } from "@/drizzle/schema"
import { eq, desc } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer"
import { DeleteResumeButton, SetPrimaryResumeButton } from "./ResumeActionButtons"

export default function UserResumePage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6 px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Resumes</h1>
      </div>
      
      {/* Upload new resume */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Resume</CardTitle>
          <CardDescription>
            Upload additional resumes to your profile. You can mark one as your primary resume. Maximum 3 resumes allowed per user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DropzoneClient />
        </CardContent>
      </Card>

      {/* Existing resumes list */}
      <Suspense fallback={<div>Loading resumes...</div>}>
        <ResumesList />
      </Suspense>
    </div>
  )
}

async function ResumesList() {
  const { userId } = await getCurrentUser()
  
  
  if (userId == null) {
    // Return client-side wrapper instead of notFound
    return <ResumesListHybridWrapper />
  }

  const userResumes = await getUserResumes(userId)
  
  if (!userResumes || userResumes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-600">No resumes uploaded yet. Upload your first resume above.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold">Your Resumes ({userResumes.length})</h2>
      {userResumes.map((resume, index) => {
        // Check for duplicate filenames to add identifier
        const duplicateCount = userResumes.filter(r => r.file_name === resume.file_name).length
        const duplicateIndex = userResumes.filter((r, i) => r.file_name === resume.file_name && i <= index).length
        const displayName = duplicateCount > 1 ? `${resume.file_name} (${duplicateIndex})` : resume.file_name
        
        return (
        <Card key={resume.id} className={resume.is_primary ? "border-blue-500 bg-blue-50/30" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base" title={`${resume.file_name} (uploaded ${new Date(resume.created_at).toLocaleDateString()})`}>
                  {displayName}
                </CardTitle>
                {resume.is_primary && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Primary
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview
                  </Link>
                </Button>
                <SetPrimaryResumeButton 
                  resumeId={resume.id} 
                  isPrimary={resume.is_primary} 
                />
                <DeleteResumeButton 
                  resumeId={resume.id} 
                  isPrimary={resume.is_primary} 
                />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Uploaded: {new Date(resume.created_at).toLocaleDateString()}
            </p>
          </CardHeader>
          {resume.ai_summary && (
            <CardContent className="pt-0">
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-2">AI Summary</h4>
                <div className="text-sm text-gray-700">
                  <MarkdownRenderer source={resume.ai_summary} />
                </div>
              </div>
            </CardContent>
          )}
        </Card>
        )
      })}
    </div>
  )
}

// Import client wrapper
import { ResumesListHybridWrapper } from "@/features/users/components/ResumesListHybridWrapper"

async function getUserResumes(userId: string) {
  "use cache"
  cacheTag(getUserResumeIdTag(userId))

  const resumes = await db.query.UserResumeTable.findMany({
    where: eq(UserResumeTable.user_id, userId),
    orderBy: [
      desc(UserResumeTable.is_primary), // Primary resumes first
      desc(UserResumeTable.created_at)  // Then by creation date
    ],
  })

  if (process.env.NODE_ENV === 'development') {
    console.log(`📄 Fetched ${resumes.length} resumes for user ${userId}:`, resumes.map(r => r.file_name))
  }

  return resumes
}
