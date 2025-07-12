import { JobListingApplicationTable, JobListingTable } from "@/drizzle/schema"
import {
  DeletedObjectJSON,
  OrganizationJSON,
  OrganizationMembershipJSON,
  UserJSON,
} from "@clerk/nextjs/server"
import { EventSchemas, Inngest } from "inngest"

type ClerkWebhookData<T> = {
  data: {
    data: T
    raw: string
    headers: Record<string, string>
  }
}

type Events = {
  // Clerk webhook events without prefix - actual event types sent by Clerk
  "user.created": ClerkWebhookData<UserJSON>
  "user.updated": ClerkWebhookData<UserJSON>
  "user.deleted": ClerkWebhookData<DeletedObjectJSON>
  "organization.created": ClerkWebhookData<OrganizationJSON>
  "organization.updated": ClerkWebhookData<OrganizationJSON>
  "organization.deleted": ClerkWebhookData<DeletedObjectJSON>
  "organizationMembership.created": ClerkWebhookData<OrganizationMembershipJSON>
  "organizationMembership.deleted": ClerkWebhookData<OrganizationMembershipJSON>
  
  // Keep the old event types for backward compatibility
  "clerk/user.created": ClerkWebhookData<UserJSON>
  "clerk/user.updated": ClerkWebhookData<UserJSON>
  "clerk/user.deleted": ClerkWebhookData<DeletedObjectJSON>
  "clerk/organization.created": ClerkWebhookData<OrganizationJSON>
  "clerk/organization.updated": ClerkWebhookData<OrganizationJSON>
  "clerk/organization.deleted": ClerkWebhookData<DeletedObjectJSON>
  "clerk/organizationMembership.created": ClerkWebhookData<OrganizationMembershipJSON>
  "clerk/organizationMembership.deleted": ClerkWebhookData<OrganizationMembershipJSON>
  "app/jobListingApplication.created": {
    data: {
      jobListingId: string
      userId: string
    }
  }
  "app/resume.uploaded": {
    user: {
      id: string
    }
  }
  "app/email.daily-user-job-listings": {
    data: {
      aiPrompt?: string
      jobListings: (Omit<
        typeof JobListingTable.$inferSelect,
        "createdAt" | "postedAt" | "updatedAt" | "status" | "organizationId"
      > & { organizationName: string })[]
    }
    user: {
      email: string
      name: string
    }
  }
  "app/email.daily-organization-user-applications": {
    data: {
      applications: (Pick<
        typeof JobListingApplicationTable.$inferSelect,
        "rating"
      > & {
        userName: string
        organizationId: string
        organizationName: string
        jobListingId: string
        jobListingTitle: string
      })[]
    }
    user: {
      email: string
      name: string
    }
  }
}

export const inngest = new Inngest({
  id: "hire-sync-ai",
  schemas: new EventSchemas().fromRecord<Events>(),
  logger: {
    debug: console.log,
    info: console.log,
    warn: console.warn,
    error: console.error,
  },
  // Enable automatic event processing in development
  isDev: process.env.NODE_ENV !== "production",
})
