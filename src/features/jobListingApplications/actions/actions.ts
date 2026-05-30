"use server"

import { db } from "@/drizzle/db"
import {
  ApplicationStage,
  applicationStages,
  JobListingTable,
  UserResumeTable,
} from "@/drizzle/schema"
import { getJobListingIdTag } from "@/features/jobListings/db/cache/jobListings"
import { getUserResumeIdTag } from "@/features/users/db/cache/userResumes"
import {
  getCurrentUser,
} from "@/services/supabase/auth"
import {
  requireOrganizationAuth,
} from "@/services/supabase/organization-auth"
import { and, eq } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { z } from "zod"
import { newJobListingApplicationSchema } from "./schemas"
import {
  insertJobListingApplication,
  updateJobListingApplication,
} from "../db/jobListingsApplications"
// Removed organization permission import as we use user-based permissions

export async function createJobListingApplication(
  jobListingId: string,
  unsafeData: z.infer<typeof newJobListingApplicationSchema>
) {
  const permissionError = {
    error: true,
    message: "You don't have permission to submit an application",
  }
  const { userId } = await getCurrentUser()
  if (userId == null) return permissionError

  const [userResume, jobListing] = await Promise.all([
    getUserResume(userId),
    getPublicJobListing(jobListingId),
  ])
  if (userResume == null || jobListing == null) return permissionError

  const { success, data } = newJobListingApplicationSchema.safeParse(unsafeData)

  if (!success) {
    return {
      error: true,
      message: "There was an error submitting your application",
    }
  }

  await insertJobListingApplication({
    job_listing_id: jobListingId,
    applicant_user_id: userId,
    ...data,
  })

  // TODO: Add direct application ranking/processing here if needed

  return {
    error: false,
    message: "Your application was successfully submitted",
  }
}

export async function updateJobListingApplicationStage(
  {
    jobListingId,
    userId: applicantUserId,
  }: {
    jobListingId: string
    userId: string
  },
  unsafeStage: ApplicationStage
) {
  const { success, data: stage } = z
    .enum(applicationStages)
    .safeParse(unsafeStage)

  if (!success) {
    return {
      error: true,
      message: "Invalid stage",
    }
  }

  // Permission check handled by organization ownership verification below

  const { organizationId } = await requireOrganizationAuth()
  const jobListing = await getJobListing(jobListingId)
  if (
    organizationId == null ||
    jobListing == null ||
    organizationId !== jobListing.organization_id
  ) {
    return {
      error: true,
      message: "You don't have permission to update the stage",
    }
  }

  await updateJobListingApplication(
    {
      jobListingId,
      userId: applicantUserId,
    },
    { stage }
  )
}

export async function updateJobListingApplicationRating(
  {
    jobListingId,
    userId: applicantUserId,
  }: {
    jobListingId: string
    userId: string
  },
  unsafeRating: number | null
) {
  const { success, data: rating } = z
    .number()
    .min(1)
    .max(5)
    .nullish()
    .safeParse(unsafeRating)

  if (!success) {
    return {
      error: true,
      message: "Invalid rating",
    }
  }

  // Permission check handled by organization ownership verification below

  const { organizationId } = await requireOrganizationAuth()
  const jobListing = await getJobListing(jobListingId)
  if (
    organizationId == null ||
    jobListing == null ||
    organizationId !== jobListing.organization_id
  ) {
    return {
      error: true,
      message: "You don't have permission to update the rating",
    }
  }

  await updateJobListingApplication(
    {
      jobListingId,
      userId: applicantUserId,
    },
    { rating }
  )
}

async function getPublicJobListing(id: string) {
  "use cache"
  cacheTag(getJobListingIdTag(id))

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.status, "published")
    ),
    columns: { id: true },
  })
}

async function getJobListing(id: string) {
  "use cache"
  cacheTag(getJobListingIdTag(id))

  return db.query.JobListingTable.findFirst({
    where: eq(JobListingTable.id, id),
    columns: { organization_id: true },
  })
}

async function getUserResume(userId: string) {
  "use cache"
  cacheTag(getUserResumeIdTag(userId))

  return db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.user_id, userId),
    columns: { user_id: true },
  })
}
