import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dataCache"
import { revalidateTag } from "next/cache"

export function getJobListingGlobalTag() {
  return getGlobalTag("jobListings")
}

export function getJobListingIdTag(id: string) {
  return getIdTag("jobListings", id)
}

export function getJobListingUserTag(userId: string) {
  return getUserTag("jobListings", userId)
}

export function getJobListingOrganizationTag(organizationId: string) {
  return `jobListings-organization-${organizationId}`
}

export function revalidateJobListingCacheUser({
  id,
  userId,
}: {
  id: string
  userId: string
}) {
  revalidateTag(getJobListingGlobalTag())
  revalidateTag(getJobListingUserTag(userId))
  revalidateTag(getJobListingIdTag(id))
}

export function revalidateJobListingCacheOrganization({
  id,
  organizationId,
}: {
  id: string
  organizationId: string
}) {
  revalidateTag(getJobListingGlobalTag())
  revalidateTag(getJobListingOrganizationTag(organizationId))
  revalidateTag(getJobListingIdTag(id))
}
