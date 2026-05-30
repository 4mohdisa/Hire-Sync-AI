import { db } from "@/drizzle/db"
import { JobListingTable } from "@/drizzle/schema"
import { getJobListingUserTag } from "@/features/jobListings/db/cache/jobListings"
import { requireOrganizationAuth } from "@/services/supabase/organization-auth"
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
  const { organizationId } = await requireOrganizationAuth()

  const jobListing = await getMostRecentJobListing(organizationId)
  if (jobListing == null) {
    redirect("/employer/job-listings/new")
  } else {
    redirect(`/employer/job-listings/${jobListing.id}`)
  }
  
  return null
}

async function getMostRecentJobListing(organizationId: string) {
  "use cache"
  cacheTag(getJobListingUserTag(organizationId))

  return db.query.JobListingTable.findFirst({
    where: eq(JobListingTable.organization_id, organizationId),
    orderBy: desc(JobListingTable.created_at),
    columns: { id: true },
  })
}
