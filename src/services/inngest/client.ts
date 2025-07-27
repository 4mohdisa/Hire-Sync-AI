import { JobListingApplicationTable, JobListingTable } from "@/drizzle/schema"
import { EventSchemas, Inngest } from "inngest"

// Application-specific events only (no Clerk events)
type Events = {
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
  // Force production mode
  isDev: false,
})
