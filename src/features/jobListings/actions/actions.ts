"use server"

import { z } from "zod"
import { jobListingAiSearchSchema, jobListingSchema } from "./schemas"
import {
  getCurrentUser,
} from "@/services/supabase/auth"
import { 
  requireOrganizationAuth 
} from "@/services/supabase/organization-auth"
import { redirect } from "next/navigation"
import {
  insertJobListing,
  updateJobListing as updateJobListingDb,
  deleteJobListing as deleteJobListingDb,
} from "../db/jobListings"
import { db } from "@/drizzle/db"
import { and, eq } from "drizzle-orm"
import { JobListingTable } from "@/drizzle/schema"
import {
  getJobListingGlobalTag,
  getJobListingIdTag,
} from "../db/cache/jobListings"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
// Removed organization permission imports as we use user-based permissions
import { getNextJobListingStatus } from "../lib/utils"
// TODO: Replace with direct AI job matching function

export async function createJobListing(
  unsafeData: z.infer<typeof jobListingSchema>
) {
  // Require organization authentication
  const { organizationId } = await requireOrganizationAuth()

  const { success, data } = jobListingSchema.safeParse(unsafeData)
  if (!success) {
    return {
      error: true,
      message: "There was an error creating your job listing",
    }
  }

  const jobListing = await insertJobListing({
    title: data.title,
    description: data.description,
    experience_level: data.experienceLevel,
    location_requirement: data.locationRequirement,
    type: data.type,
    wage: data.wage,
    wage_interval: data.wageInterval,
    state_abbreviation: data.stateAbbreviation,
    city: data.city,
    organization_id: organizationId,
    status: "draft",
  })

  redirect(`/organization/job-listings/${jobListing.id}`)
}

export async function updateJobListing(
  id: string,
  unsafeData: z.infer<typeof jobListingSchema>
) {
  const { organizationId } = await requireOrganizationAuth()

  const { success, data } = jobListingSchema.safeParse(unsafeData)
  if (!success) {
    return {
      error: true,
      message: "There was an error updating your job listing",
    }
  }

  const jobListing = await getOrganizationJobListing(id, organizationId)
  if (jobListing == null) {
    return {
      error: true,
      message: "There was an error updating your job listing",
    }
  }

  const updatedJobListing = await updateJobListingDb(id, {
    title: data.title,
    description: data.description,
    experience_level: data.experienceLevel,
    location_requirement: data.locationRequirement,
    type: data.type,
    wage: data.wage,
    wage_interval: data.wageInterval,
    state_abbreviation: data.stateAbbreviation,
    city: data.city,
  })

  redirect(`/organization/job-listings/${updatedJobListing.id}`)
}

export async function toggleJobListingStatus(id: string) {
  const error = {
    error: true,
    message: "You don't have permission to update this job listing's status",
  }
  const { organizationId } = await requireOrganizationAuth()

  const jobListing = await getOrganizationJobListing(id, organizationId)
  if (jobListing == null) return error

  const newStatus = getNextJobListingStatus(jobListing.status)
  // Permission check handled by user ownership verification

  await updateJobListingDb(id, {
    status: newStatus,
    is_featured: newStatus === "published" ? undefined : false,
    posted_at:
      newStatus === "published" && jobListing.posted_at == null
        ? new Date()
        : undefined,
  })

  return { error: false }
}

export async function toggleJobListingFeatured(id: string) {
  const error = {
    error: true,
    message:
      "You don't have permission to update this job listing's featured status",
  }
  const { organizationId } = await requireOrganizationAuth()

  const jobListing = await getOrganizationJobListing(id, organizationId)
  if (jobListing == null) return error

  const newFeaturedStatus = !jobListing.is_featured
  // Permission check handled by user ownership verification

  await updateJobListingDb(id, {
    is_featured: newFeaturedStatus,
  })

  return { error: false }
}

export async function deleteJobListing(id: string) {
  const error = {
    error: true,
    message: "You don't have permission to delete this job listing",
  }
  const { organizationId } = await requireOrganizationAuth()

  const jobListing = await getOrganizationJobListing(id, organizationId)
  if (jobListing == null) return error

  // Permission check handled by organization ownership verification

  await deleteJobListingDb(id)

  redirect("/organization/dashboard")
}

export async function getAiJobListingSearchResults(
  unsafe: z.infer<typeof jobListingAiSearchSchema>
): Promise<
  { error: true; message: string } | { error: false; jobIds: string[] }
> {
  const { success, data } = jobListingAiSearchSchema.safeParse(unsafe)
  if (!success) {
    return {
      error: true,
      message: "There was an error processing your search query",
    }
  }

  const { userId } = await getCurrentUser()
  if (userId == null) {
    return {
      error: true,
      message: "You need an account to use AI job search",
    }
  }

  const allListings = await getPublicJobListings()
  
  // TODO: Replace with proper AI matching - for now return simple text search
  const matchedListings = allListings
    .filter(job => 
      job.title.toLowerCase().includes(data.query.toLowerCase()) ||
      job.description.toLowerCase().includes(data.query.toLowerCase())
    )
    .slice(0, 10)
    .map(job => job.id)

  if (matchedListings.length === 0) {
    return {
      error: true,
      message: "No jobs match your search criteria",
    }
  }

  return { error: false, jobIds: matchedListings }
}

async function getOrganizationJobListing(id: string, organizationId: string) {
  "use cache"
  cacheTag(getJobListingIdTag(id))

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.organization_id, organizationId)
    ),
  })
}

async function getPublicJobListings() {
  "use cache"
  cacheTag(getJobListingGlobalTag())

  return db.query.JobListingTable.findMany({
    where: eq(JobListingTable.status, "published"),
  })
}
