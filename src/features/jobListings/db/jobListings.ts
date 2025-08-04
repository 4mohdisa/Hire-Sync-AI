import { db } from "@/drizzle/db"
import { JobListingTable } from "@/drizzle/schema"
import { revalidateJobListingCacheUser } from "./cache/jobListings"
import { eq } from "drizzle-orm"

export async function insertJobListing(
  jobListing: typeof JobListingTable.$inferInsert
) {
  const [newListing] = await db
    .insert(JobListingTable)
    .values(jobListing)
    .returning({
      id: JobListingTable.id,
      user_id: JobListingTable.user_id,
    })

  revalidateJobListingCacheUser({ id: newListing.id, userId: newListing.user_id })

  return newListing
}

export async function updateJobListing(
  id: string,
  jobListing: Partial<typeof JobListingTable.$inferInsert>
) {
  const [updatedListing] = await db
    .update(JobListingTable)
    .set(jobListing)
    .where(eq(JobListingTable.id, id))
    .returning({
      id: JobListingTable.id,
      user_id: JobListingTable.user_id,
    })

  revalidateJobListingCacheUser({ id: updatedListing.id, userId: updatedListing.user_id })

  return updatedListing
}

export async function deleteJobListing(id: string) {
  const [deletedJobListing] = await db
    .delete(JobListingTable)
    .where(eq(JobListingTable.id, id))
    .returning({
      id: JobListingTable.id,
      user_id: JobListingTable.user_id,
    })

  revalidateJobListingCacheUser({ id: deletedJobListing.id, userId: deletedJobListing.user_id })

  return deletedJobListing
}
