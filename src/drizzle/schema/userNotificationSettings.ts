import { pgTable, boolean, timestamp, uuid } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { UserTable } from "./user"

export const UserNotificationSettingsTable = pgTable(
  "user_notification_settings",
  {
    id: uuid().primaryKey().defaultRandom(),
    user_id: uuid("user_id") // Use snake_case
      .references(() => UserTable.id, { onDelete: "cascade" })
      .notNull()
      .unique(),
    email_notifications: boolean("email_notifications").notNull().default(true), // Use snake_case
    application_updates: boolean("application_updates").notNull().default(true), // Use snake_case
    new_job_alerts: boolean("new_job_alerts").notNull().default(false), // Use snake_case
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(), // Use snake_case
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(), // Use snake_case
  }
)

export const userNotificationSettingsRelations = relations(
  UserNotificationSettingsTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UserNotificationSettingsTable.user_id],
      references: [UserTable.id],
    }),
  })
)