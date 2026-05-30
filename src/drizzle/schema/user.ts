import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { UserResumeTable } from "./userResume"
import { UserNotificationSettingsTable } from "./userNotificationSettings"

export const UserTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(), // Use UUID instead of Clerk ID
  email: varchar().notNull().unique(),
  name: varchar(),
  image_url: varchar("image_url"), // Use snake_case to match database
  phone: varchar(),
  location: varchar(),
  website: varchar(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const userRelations = relations(UserTable, ({ one, many }) => ({
  notificationSettings: one(UserNotificationSettingsTable),
  resumes: many(UserResumeTable), // Changed to many for multiple resumes
  // jobListings relation will be defined in jobListing.ts to avoid circular imports
}))