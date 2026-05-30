import { db } from "@/drizzle/db"
import { JobListingApplicationTable } from "@/drizzle/schema"
import { revalidateJobListingApplicationCache } from "./cache/jobListingApplications"
import { and, eq } from "drizzle-orm"

export async function insertJobListingApplication(
  application: typeof JobListingApplicationTable.$inferInsert
) {
  await db.insert(JobListingApplicationTable).values(application)

  revalidateJobListingApplicationCache({
    userId: application.applicant_user_id,
    jobListingId: application.job_listing_id
  })
}

export async function updateJobListingApplication(
  {
    jobListingId,
    userId,
  }: {
    jobListingId: string
    userId: string
  },
  data: Partial<typeof JobListingApplicationTable.$inferInsert>
) {
  await db
    .update(JobListingApplicationTable)
    .set(data)
    .where(
      and(
        eq(JobListingApplicationTable.job_listing_id, jobListingId),
        eq(JobListingApplicationTable.applicant_user_id, userId)
      )
    )

  revalidateJobListingApplicationCache({ jobListingId, userId })
}
