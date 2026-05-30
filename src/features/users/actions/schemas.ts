import { z } from "zod"

export const userNotificationSettingsSchema = z.object({
  new_job_alerts: z.boolean(),
  email_notifications: z.boolean(),
})
