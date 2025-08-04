import {
  integer,
  pgEnum,
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
  index,
  uuid,
} from "drizzle-orm/pg-core"
import { UserTable } from "./user"
import { relations } from "drizzle-orm"
import { JobListingApplicationTable } from "./jobListingApplication"

export const wageIntervals = ["hourly", "yearly"] as const
export type WageInterval = (typeof wageIntervals)[number]
export const wageIntervalEnum = pgEnum(
  "job_listings_wage_interval",
  wageIntervals
)

export const locationRequirements = ["in-office", "hybrid", "remote"] as const
export type LocationRequirement = (typeof locationRequirements)[number]
export const locationRequirementEnum = pgEnum(
  "job_listings_location_requirement",
  locationRequirements
)

export const experienceLevels = ["junior", "mid-level", "senior"] as const
export type ExperienceLevel = (typeof experienceLevels)[number]
export const experienceLevelEnum = pgEnum(
  "job_listings_experience_level",
  experienceLevels
)

export const jobListingStatuses = ["draft", "published", "delisted"] as const
export type JobListingStatus = (typeof jobListingStatuses)[number]
export const jobListingStatusEnum = pgEnum(
  "job_listings_status",
  jobListingStatuses
)

export const jobListingTypes = ["internship", "part-time", "full-time"] as const
export type JobListingType = (typeof jobListingTypes)[number]
export const jobListingTypeEnum = pgEnum("job_listings_type", jobListingTypes)

export const JobListingTable = pgTable(
  "job_listings",
  {
    id: uuid().primaryKey().defaultRandom(),
    user_id: uuid("user_id") // Use snake_case to match Supabase conventions
      .references(() => UserTable.id, { onDelete: "cascade" })
      .notNull(),
    title: varchar().notNull(),
    description: text().notNull(),
    wage: integer(),
    wage_interval: wageIntervalEnum("wage_interval"), // Use snake_case
    state_abbreviation: varchar("state_abbreviation"), // Use snake_case
    city: varchar(),
    is_featured: boolean("is_featured").notNull().default(false), // Use snake_case
    location_requirement: locationRequirementEnum("location_requirement").notNull(), // Use snake_case
    experience_level: experienceLevelEnum("experience_level").notNull(), // Use snake_case
    status: jobListingStatusEnum().notNull().default("draft"),
    type: jobListingTypeEnum().notNull(),
    posted_at: timestamp("posted_at", { withTimezone: true }), // Use snake_case
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(), // Use snake_case
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(), // Use snake_case
  },
  table => [index().on(table.state_abbreviation)] // Update index reference
)

export const jobListingReferences = relations(
  JobListingTable,
  ({ one, many }) => ({
    user: one(UserTable, { // Changed from organization to user
      fields: [JobListingTable.user_id],
      references: [UserTable.id],
    }),
    applications: many(JobListingApplicationTable),
  })
)