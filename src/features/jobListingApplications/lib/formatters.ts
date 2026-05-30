import { ApplicationStage } from "@/drizzle/schema"

export function formatJobListingApplicationStage(stage: ApplicationStage) {
  switch (stage) {
    case "applied":
      return "Applied"
    case "phone-screen":
      return "Phone Screen"
    case "interview":
      return "Interview"
    case "offer":
      return "Offer"
    case "rejected":
      return "Rejected"
    default:
      throw new Error(`Unknown application stage: ${stage satisfies never}`)
  }
}
