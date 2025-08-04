import { pgTable, text, varchar, timestamp, uuid } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { UserTable } from "./user"

export const UserResumeTable = pgTable("user_resumes", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid("user_id") // Use snake_case
    .references(() => UserTable.id, { onDelete: "cascade" })
    .notNull(),
  file_name: varchar("file_name").notNull(), // Use snake_case
  url: varchar().notNull(),
  text: text(),
  ai_summary: text("ai_summary"), // Use snake_case
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(), // Use snake_case
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(), // Use snake_case
})

export const userResumeRelations = relations(UserResumeTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [UserResumeTable.user_id],
    references: [UserTable.id],
  }),
}))