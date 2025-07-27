import { NextRequest, NextResponse } from "next/server"
import { verifyWebhook } from "@/lib/webhooks/verification"
import {
  ClerkWebhookEventSchema,
  ClerkWebhookEvent,
  UserCreatedEventSchema,
  UserUpdatedEventSchema,
  UserDeletedEventSchema,
  OrganizationCreatedEventSchema,
  OrganizationUpdatedEventSchema,
  OrganizationDeletedEventSchema,
  OrganizationMembershipCreatedEventSchema,
  OrganizationMembershipDeletedEventSchema,
} from "@/lib/webhooks/clerk-types"
import { deleteUser, insertUser, updateUser } from "@/features/users/db/users"
import { insertUserNotificationSettings } from "@/features/users/db/userNotificationSettings"
import {
  deleteOrganization,
  insertOrganization,
  updateOrganization,
} from "@/features/organizations/db/organizations"
import {
  deleteOrganizationUserSettings,
  insertOrganizationUserSettings,
} from "@/features/organizations/db/organizationUserSettings"

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text()
    const headers = req.headers

    // Verify webhook signature
    const evt = verifyWebhook(payload, headers)
    
    // Parse and validate the event
    const webhookEvent = ClerkWebhookEventSchema.parse(evt)
    
    console.log(`📥 Received Clerk webhook: ${webhookEvent.type}`)

    // Handle different event types
    switch (webhookEvent.type) {
      case "user.created":
        await handleUserCreated(webhookEvent)
        break
      case "user.updated":
        await handleUserUpdated(webhookEvent)
        break
      case "user.deleted":
        await handleUserDeleted(webhookEvent)
        break
      case "organization.created":
        await handleOrganizationCreated(webhookEvent)
        break
      case "organization.updated":
        await handleOrganizationUpdated(webhookEvent)
        break
      case "organization.deleted":
        await handleOrganizationDeleted(webhookEvent)
        break
      case "organizationMembership.created":
        await handleOrganizationMembershipCreated(webhookEvent)
        break
      case "organizationMembership.deleted":
        await handleOrganizationMembershipDeleted(webhookEvent)
        break
      default:
        console.log(`⚠️ Unhandled webhook event type: ${webhookEvent.type}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

async function handleUserCreated(event: ClerkWebhookEvent) {
  const validatedEvent = UserCreatedEventSchema.parse(event)
  const { data } = validatedEvent
  
  console.log("👤 Creating user:", data.id)
  
  // Find primary email
  const email = data.email_addresses.find(
    email => email.id === data.primary_email_address_id
  )
  
  if (!email) {
    throw new Error("No primary email address found")
  }
  
  // Create user record
  const user = {
    id: data.id,
    name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Unknown User",
    imageUrl: data.image_url || "",
    email: email.email_address,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
  
  await insertUser(user)
  console.log("✅ User created in database")
  
  // Create user notification settings
  await insertUserNotificationSettings({ userId: data.id })
  console.log("✅ User notification settings created")
}

async function handleUserUpdated(event: ClerkWebhookEvent) {
  const validatedEvent = UserUpdatedEventSchema.parse(event)
  const { data } = validatedEvent
  
  console.log("👤 Updating user:", data.id)
  
  // Find primary email
  const email = data.email_addresses.find(
    email => email.id === data.primary_email_address_id
  )
  
  if (!email) {
    throw new Error("No primary email address found")
  }
  
  await updateUser(data.id, {
    name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Unknown User",
    imageUrl: data.image_url || "",
    email: email.email_address,
    updatedAt: new Date(data.updated_at),
  })
  
  console.log("✅ User updated in database")
}

async function handleUserDeleted(event: ClerkWebhookEvent) {
  const validatedEvent = UserDeletedEventSchema.parse(event)
  const { data } = validatedEvent
  
  console.log("👤 Deleting user:", data.id)
  
  await deleteUser(data.id)
  console.log("✅ User deleted from database")
}

async function handleOrganizationCreated(event: ClerkWebhookEvent) {
  const validatedEvent = OrganizationCreatedEventSchema.parse(event)
  const { data } = validatedEvent
  
  console.log("🏢 Creating organization:", data.id)
  
  await insertOrganization({
    id: data.id,
    name: data.name,
    imageUrl: data.image_url || "",
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  })
  
  console.log("✅ Organization created in database")
}

async function handleOrganizationUpdated(event: ClerkWebhookEvent) {
  const validatedEvent = OrganizationUpdatedEventSchema.parse(event)
  const { data } = validatedEvent
  
  console.log("🏢 Updating organization:", data.id)
  
  await updateOrganization(data.id, {
    name: data.name,
    imageUrl: data.image_url || "",
    updatedAt: new Date(data.updated_at),
  })
  
  console.log("✅ Organization updated in database")
}

async function handleOrganizationDeleted(event: ClerkWebhookEvent) {
  const validatedEvent = OrganizationDeletedEventSchema.parse(event)
  const { data } = validatedEvent
  
  console.log("🏢 Deleting organization:", data.id)
  
  await deleteOrganization(data.id)
  console.log("✅ Organization deleted from database")
}

async function handleOrganizationMembershipCreated(event: ClerkWebhookEvent) {
  const validatedEvent = OrganizationMembershipCreatedEventSchema.parse(event)
  const { data } = validatedEvent
  
  const userId = data.public_user_data.user_id
  const orgId = data.organization.id
  
  console.log("👥 Creating organization membership:", { userId, orgId })
  
  await insertOrganizationUserSettings({
    userId,
    organizationId: orgId,
  })
  
  console.log("✅ Organization membership created in database")
}

async function handleOrganizationMembershipDeleted(event: ClerkWebhookEvent) {
  const validatedEvent = OrganizationMembershipDeletedEventSchema.parse(event)
  const { data } = validatedEvent
  
  const userId = data.public_user_data.user_id
  const orgId = data.organization.id
  
  console.log("👥 Deleting organization membership:", { userId, orgId })
  
  await deleteOrganizationUserSettings({
    userId,
    organizationId: orgId,
  })
  
  console.log("✅ Organization membership deleted from database")
}