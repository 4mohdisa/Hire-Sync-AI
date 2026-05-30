import { db } from "@/drizzle/db"
import { UserNotificationSettingsTable } from "@/drizzle/schema"
import { revalidateUserNotificationSettingsCache } from "./cache/userNotificationSettings"

export async function insertUserNotificationSettings(
  settings: typeof UserNotificationSettingsTable.$inferInsert
) {
  await db
    .insert(UserNotificationSettingsTable)
    .values(settings)
    .onConflictDoNothing()

  revalidateUserNotificationSettingsCache(settings.user_id)
}

export async function updateUserNotificationSettings(
  userId: string,
  settings: Partial<
    Omit<typeof UserNotificationSettingsTable.$inferInsert, "user_id">
  >
) {
  await db
    .insert(UserNotificationSettingsTable)
    .values({ ...settings, user_id: userId })
    .onConflictDoUpdate({
      target: UserNotificationSettingsTable.user_id,
      set: settings,
    })

  revalidateUserNotificationSettingsCache(userId)
}
