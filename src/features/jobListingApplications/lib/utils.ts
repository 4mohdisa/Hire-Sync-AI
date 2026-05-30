import { ApplicationStage } from "@/drizzle/schema"

export function sortApplicationsByStage(
  a: ApplicationStage,
  b: ApplicationStage
): number {
  return APPLICATION_STAGE_SORT_ORDER[a] - APPLICATION_STAGE_SORT_ORDER[b]
}

const APPLICATION_STAGE_SORT_ORDER: Record<ApplicationStage, number> = {
  applied: 0,
  "phone-screen": 1,
  interview: 2,
  offer: 3,
  rejected: 4,
}
