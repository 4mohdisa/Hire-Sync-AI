import { z } from "zod"

// Clerk webhook event types
export const ClerkWebhookEventSchema = z.object({
  type: z.string(),
  data: z.record(z.any()),
  object: z.literal("event"),
  timestamp: z.number(),
})

export type ClerkWebhookEvent = z.infer<typeof ClerkWebhookEventSchema>

// User event schemas
export const UserCreatedEventSchema = z.object({
  type: z.literal("user.created"),
  data: z.object({
    id: z.string(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    email_addresses: z.array(
      z.object({
        id: z.string(),
        email_address: z.string(),
      })
    ),
    primary_email_address_id: z.string(),
    image_url: z.string().nullable(),
    created_at: z.number(),
    updated_at: z.number(),
  }),
})

export const UserUpdatedEventSchema = z.object({
  type: z.literal("user.updated"),
  data: z.object({
    id: z.string(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    email_addresses: z.array(
      z.object({
        id: z.string(),
        email_address: z.string(),
      })
    ),
    primary_email_address_id: z.string(),
    image_url: z.string().nullable(),
    updated_at: z.number(),
  }),
})

export const UserDeletedEventSchema = z.object({
  type: z.literal("user.deleted"),
  data: z.object({
    id: z.string(),
  }),
})

// Organization event schemas
export const OrganizationCreatedEventSchema = z.object({
  type: z.literal("organization.created"),
  data: z.object({
    id: z.string(),
    name: z.string(),
    image_url: z.string().nullable(),
    created_at: z.number(),
    updated_at: z.number(),
  }),
})

export const OrganizationUpdatedEventSchema = z.object({
  type: z.literal("organization.updated"),
  data: z.object({
    id: z.string(),
    name: z.string(),
    image_url: z.string().nullable(),
    updated_at: z.number(),
  }),
})

export const OrganizationDeletedEventSchema = z.object({
  type: z.literal("organization.deleted"),
  data: z.object({
    id: z.string(),
  }),
})

// Organization membership event schemas
export const OrganizationMembershipCreatedEventSchema = z.object({
  type: z.literal("organizationMembership.created"),
  data: z.object({
    public_user_data: z.object({
      user_id: z.string(),
    }),
    organization: z.object({
      id: z.string(),
    }),
  }),
})

export const OrganizationMembershipDeletedEventSchema = z.object({
  type: z.literal("organizationMembership.deleted"),
  data: z.object({
    public_user_data: z.object({
      user_id: z.string(),
    }),
    organization: z.object({
      id: z.string(),
    }),
  }),
})

export type UserCreatedEvent = z.infer<typeof UserCreatedEventSchema>
export type UserUpdatedEvent = z.infer<typeof UserUpdatedEventSchema>
export type UserDeletedEvent = z.infer<typeof UserDeletedEventSchema>
export type OrganizationCreatedEvent = z.infer<typeof OrganizationCreatedEventSchema>
export type OrganizationUpdatedEvent = z.infer<typeof OrganizationUpdatedEventSchema>
export type OrganizationDeletedEvent = z.infer<typeof OrganizationDeletedEventSchema>
export type OrganizationMembershipCreatedEvent = z.infer<typeof OrganizationMembershipCreatedEventSchema>
export type OrganizationMembershipDeletedEvent = z.infer<typeof OrganizationMembershipDeletedEventSchema>