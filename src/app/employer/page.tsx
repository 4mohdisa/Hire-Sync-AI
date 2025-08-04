import { db } from "@/drizzle/db"
import { JobListingTable } from "@/drizzle/schema"
import { getJobListingUserTag } from "@/features/jobListings/db/cache/jobListings"
import { getCurrentUser } from "@/services/supabase/auth"
import { desc, eq } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export default function EmployerHomePage() {
  return (
    <Suspense>
      <SuspendedPage />
    </Suspense>
  )
}

async function SuspendedPage() {
  const { userId } = await getCurrentUser()
  if (userId == null) return null

  const jobListing = await getMostRecentJobListing(userId)
  if (jobListing == null) {
    redirect("/employer/job-listings/new")
  } else {
    redirect(`/employer/job-listings/${jobListing.id}`)
  }
}

async function getMostRecentJobListing(userId: string) {
  "use cache"
  cacheTag(getJobListingUserTag(userId))

  return db.query.JobListingTable.findFirst({
    where: eq(JobListingTable.user_id, userId),
    orderBy: desc(JobListingTable.createdAt),
    columns: { id: true },
  })
}
