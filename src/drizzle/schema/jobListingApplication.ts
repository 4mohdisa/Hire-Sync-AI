import {
  pgEnum,
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { JobListingTable } from "./jobListing"
import { UserTable } from "./user"

export const applicationStages = [
  "applied",
  "phone-screen",
  "interview",
  "offer",
  "rejected",
] as const
export type ApplicationStage = (typeof applicationStages)[number]
export const applicationStageEnum = pgEnum(
  "job_listing_applications_stage",
  applicationStages
)

export const JobListingApplicationTable = pgTable("job_listing_applications", {
  id: uuid().primaryKey().defaultRandom(),
  job_listing_id: uuid("job_listing_id") // Use snake_case
    .references(() => JobListingTable.id, { onDelete: "cascade" })
    .notNull(),
  applicant_user_id: uuid("applicant_user_id") // Use snake_case
    .references(() => UserTable.id, { onDelete: "cascade" })
    .notNull(),
  stage: applicationStageEnum().notNull().default("applied"),
  rating: integer(), // 1-5 rating
  notes: text(),
  resume_text: text("resume_text"), // Use snake_case
  ai_summary: text("ai_summary"), // Use snake_case
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(), // Use snake_case
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(), // Use snake_case
})

export const jobListingApplicationRelations = relations(
  JobListingApplicationTable,
  ({ one }) => ({
    jobListing: one(JobListingTable, {
      fields: [JobListingApplicationTable.job_listing_id],
      references: [JobListingTable.id],
    }),
    applicant: one(UserTable, {
      fields: [JobListingApplicationTable.applicant_user_id],
      references: [UserTable.id],
    }),
  })
)