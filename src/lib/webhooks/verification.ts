import { Webhook } from "svix"
import { env } from "@/data/env/server"

export function verifyWebhook(payload: string, headers: Headers) {
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET)
  
  const svixId = headers.get("svix-id")
  const svixTimestamp = headers.get("svix-timestamp")
  const svixSignature = headers.get("svix-signature")

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new Error("Missing svix headers")
  }

  // Verify the webhook signature
  const evt = wh.verify(payload, {
    "svix-id": svixId,
    "svix-timestamp": svixTimestamp,
    "svix-signature": svixSignature,
  })

  return evt
}