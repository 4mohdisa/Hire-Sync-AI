import { pgTable, varchar, timestamp, uuid, text, boolean } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { JobListingTable } from "./jobListing"

export const OrganizationTable = pgTable("organizations", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar().notNull().unique(), // Organization email for authentication
  company_name: varchar("company_name").notNull(), // Company name
  logo_url: varchar("logo_url"), // Company logo URL
  website_url: varchar("website_url"), // Company website
  description: text(), // Company description
  industry: varchar(), // Industry type
  company_size: varchar("company_size"), // e.g., "1-10", "11-50", "51-200", etc.
  // Note: location and phone columns removed to match actual database schema
  is_verified: boolean("is_verified").notNull().default(false), // Email verification status
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const organizationRelations = relations(OrganizationTable, ({ many }) => ({
  jobListings: many(JobListingTable),
  // organizationMembers: many(OrganizationMemberTable), // For future team management
}))

// For future: Organization members/team management
// export const OrganizationMemberTable = pgTable("organization_members", {
//   id: uuid().primaryKey().defaultRandom(),
//   organization_id: uuid("organization_id")
//     .references(() => OrganizationTable.id, { onDelete: "cascade" })
//     .notNull(),
//   user_id: uuid("user_id")
//     .references(() => UserTable.id, { onDelete: "cascade" })
//     .notNull(),
//   role: varchar().$type<"admin" | "member" | "viewer">().notNull().default("member"),
//   invited_by: uuid("invited_by")
//     .references(() => UserTable.id),
//   joined_at: timestamp("joined_at", { withTimezone: true }).defaultNow(),
//   created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
// })