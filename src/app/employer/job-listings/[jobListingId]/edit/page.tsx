import { Card, CardContent } from "@/components/ui/card"
import { db } from "@/drizzle/db"
import { JobListingTable } from "@/drizzle/schema"
import { JobListingForm } from "@/features/jobListings/components/JobListingForm"
import { getJobListingIdTag } from "@/features/jobListings/db/cache/jobListings"
import { requireOrganizationAuth } from "@/services/supabase/organization-auth"
import { and, eq } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { notFound } from "next/navigation"
import { Suspense } from "react"

type Props = {
  params: Promise<{ jobListingId: string }>
}

export default function EditJobListingPage(props: Props) {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Edit Job Listing</h1>
      <Card>
        <CardContent>
          <Suspense>
            <SuspendedPage {...props} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

async function SuspendedPage({ params }: Props) {
  const { jobListingId } = await params
  const { organizationId } = await requireOrganizationAuth()

  const jobListing = await getJobListing(jobListingId, organizationId)
  if (jobListing == null) return notFound()

  return <JobListingForm jobListing={jobListing} />
}

async function getJobListing(id: string, organizationId: string) {
  "use cache"
  cacheTag(getJobListingIdTag(id))

  const result = await db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.organization_id, organizationId)
    ),
  })

  if (!result) return null

  // Transform snake_case to camelCase to match form expectations
  return {
    ...result,
    experienceLevel: result.experience_level,
    stateAbbreviation: result.state_abbreviation,
    wageInterval: result.wage_interval,
    locationRequirement: result.location_requirement,
  }
}
