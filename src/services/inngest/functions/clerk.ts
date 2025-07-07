// Add DEBUG flag to enable additional logging
const DEBUG = true;

// Import SQL for direct database access
import { sql } from "drizzle-orm";

import { env } from "@/data/env/server"
import { inngest } from "../client"
import { NonRetriableError } from "inngest"
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

// Debug logger that only logs when DEBUG is true
function debugLog(message: string, data?: any) {
  if (DEBUG) {
    const timestamp = new Date().toISOString();
    console.log(`[DEBUG ${timestamp}] ${message}`, data ? JSON.stringify(data) : '');
  }
}

debugLog('Clerk webhook functions module loaded');
debugLog('DATABASE_URL is configured as', { url: env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@') });

export const clerkCreateUser = inngest.createFunction(
  { id: "clerk/create-db-user", name: "Clerk - Create DB User" },
  {
    event: "user.created",
  },
  async ({ event, step }) => {
    console.log("🚨🚨🚨 INNGEST FUNCTION TRIGGERED: user.created 🚨🚨🚨");
    debugLog("⭐ RECEIVED USER.CREATED EVENT", event.data); console.log("⭐ RECEIVED USER.CREATED EVENT - webhook processing started");
    
    // Dump environment info to check configuration
    debugLog("Environment check", {
      dbUrl: env.DATABASE_URL?.substring(0, 15) + "...",
    });

    try {
      // Skip webhook verification - Inngest handles this for direct Clerk integration
      console.log("✅ Using direct Clerk->Inngest integration (verification handled by Inngest)");

      const userId = await step.run("create-user", async () => {
        try {
          debugLog("Starting user creation");
          console.log("📝 Extracting user data from webhook...");
          const userData = event.data.data.data;
          debugLog("User data from webhook", userData);
          console.log("👤 User data received from Clerk");
          
          console.log("📧 Finding primary email...");
          const email = userData.email_addresses.find(
            email => email.id === userData.primary_email_address_id
          );

          if (email == null) {
            console.error("❌ No primary email address found");
            throw new NonRetriableError("No primary email address found");
          }
          console.log("✅ Found primary email:", email.email_address);

          const user = {
            id: userData.id,
            name: `${userData.first_name} ${userData.last_name}`,
            imageUrl: userData.image_url || "",
            email: email.email_address,
            createdAt: new Date(userData.created_at),
            updatedAt: new Date(userData.updated_at),
          };
          debugLog("Prepared user object for DB insertion", user);
          console.log("📥 Inserting user into database...");
          
          // Direct DB test to verify connection before user insertion
          try {
            const { db } = await import("@/drizzle/db");
            const result = await db.execute(sql`SELECT NOW()`);
            debugLog("Database connection test successful", { result: result.rows });
          } catch (dbError) {
            const dbErrorMsg = dbError instanceof Error ? dbError.message : String(dbError);
            debugLog("Database connection test failed", { error: dbErrorMsg });
            console.error("❌ Database connection failed:", dbErrorMsg);
          }

          // Let's directly use a transaction to catch any errors
          try {
            const { db } = await import("@/drizzle/db");
            const { UserTable } = await import("@/drizzle/schema");
            await db.transaction(async (tx) => {
              await tx.insert(UserTable).values(user).onConflictDoNothing();
              debugLog("User insertion transaction completed");
            });
            console.log("✅ User inserted successfully with ID:", userData.id);
          } catch (txError) {
            const txErrorMsg = txError instanceof Error ? txError.message : String(txError);
            debugLog("Transaction error during user insertion", { error: txErrorMsg });
            console.error("❌ Transaction error during user insertion:", txErrorMsg);
            // Continue execution, but log the error
          }

          // Call the original insertUser function as a fallback
          await insertUser(user);
          console.log("✅ User insertion attempt via insertUser() completed");
          
          return userData.id;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          debugLog("Error in create-user step", { error: errorMessage });
          console.error("❌ Error inserting user:", errorMessage);
          throw error;
        }
      });

      await step.run("create-user-notification-settings", async () => {
        try {
          console.log("⚙️ Creating user notification settings for user:", userId);
          await insertUserNotificationSettings({ userId });
          console.log("✅ User notification settings created successfully");
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          debugLog("Error in create-user-notification-settings step", { error: errorMessage });
          console.error("❌ Error creating notification settings:", errorMessage);
          throw error;
        }
      });

      // Final verification - check if user was actually inserted
      await step.run("verify-user-inserted", async () => {
        try {
          const { db } = await import("@/drizzle/db");
          const { UserTable } = await import("@/drizzle/schema");
          const { eq } = await import("drizzle-orm");
          const { sql } = await import("drizzle-orm");
          
          // Use raw SQL for maximum compatibility
          const result = await db.execute(sql`SELECT * FROM users WHERE id = ${userId}`);
          const foundUser = result.rows[0];
          
          if (foundUser) {
            debugLog("User verification successful - user found in database", { userId, user: foundUser });
            console.log("🎉 Final verification: User exists in database!");
          } else {
            debugLog("User verification failed - user not found in database", { userId });
            console.error("⚠️ Final verification: User NOT found in database!");
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          debugLog("Error in verify-user-inserted step", { error: errorMessage });
          console.error("❌ Error verifying user insertion:", errorMessage);
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      debugLog("Unhandled error in webhook processing", { error: errorMessage });
      console.error("❌ Unhandled error during webhook processing:", errorMessage);
      throw error;
    }
  }
)

export const clerkUpdateUser = inngest.createFunction(
  { id: "clerk/update-db-user", name: "Clerk - Update DB User" },
  { event: "user.updated" },
  async ({ event, step }) => {
    await step.run("update-user", async () => {
      const userData = event.data.data
      const email = userData.email_addresses.find(
        email => email.id === userData.primary_email_address_id
      )

      if (email == null) {
        throw new NonRetriableError("No primary email address found")
      }

      await updateUser(userData.id, {
        name: `${userData.first_name} ${userData.last_name}`,
        imageUrl: userData.image_url,
        email: email.email_address,
        updatedAt: new Date(userData.updated_at),
      })
    })
  }
)

export const clerkDeleteUser = inngest.createFunction(
  { id: "clerk/delete-db-user", name: "Clerk - Delete DB User" },
  { event: "user.deleted" },
  async ({ event, step }) => {
    await step.run("delete-user", async () => {
      const { id } = event.data.data

      if (id == null) {
        throw new NonRetriableError("No id found")
      }
      await deleteUser(id)
    })
  }
)

export const clerkCreateOrganization = inngest.createFunction(
  {
    id: "clerk/create-db-organization",
    name: "Clerk - Create DB Organization",
  },
  {
    event: "organization.created",
  },
  async ({ event, step }) => {
    await step.run("create-organization", async () => {
      const orgData = event.data.data

      await insertOrganization({
        id: orgData.id,
        name: orgData.name,
        imageUrl: orgData.image_url,
        createdAt: new Date(orgData.created_at),
        updatedAt: new Date(orgData.updated_at),
      })
    })
  }
)

export const clerkUpdateOrganization = inngest.createFunction(
  {
    id: "clerk/update-db-organization",
    name: "Clerk - Update DB Organization",
  },
  { event: "organization.updated" },
  async ({ event, step }) => {
    await step.run("update-organization", async () => {
      const orgData = event.data.data

      await updateOrganization(orgData.id, {
        name: orgData.name,
        imageUrl: orgData.image_url,
        updatedAt: new Date(orgData.updated_at),
      })
    })
  }
)

export const clerkDeleteOrganization = inngest.createFunction(
  {
    id: "clerk/delete-db-organization",
    name: "Clerk - Delete DB Organization",
  },
  { event: "organization.deleted" },
  async ({ event, step }) => {
    await step.run("delete-organization", async () => {
      const { id } = event.data.data

      if (id == null) {
        throw new NonRetriableError("No id found")
      }
      await deleteOrganization(id)
    })
  }
)

export const clerkCreateOrgMembership = inngest.createFunction(
  {
    id: "clerk/create-organization-user-settings",
    name: "Clerk - Create Organization User Settings",
  },
  {
    event: "organizationMembership.created",
  },
  async ({ event, step }) => {
    await step.run("create-organization-user-settings", async () => {
      const userId = event.data.data.public_user_data.user_id
      const orgId = event.data.data.organization.id

      await insertOrganizationUserSettings({
        userId,
        organizationId: orgId,
      })
    })
  }
)

export const clerkDeleteOrgMembership = inngest.createFunction(
  {
    id: "clerk/delete-organization-user-settings",
    name: "Clerk - Delete Organization User Settings",
  },
  {
    event: "organizationMembership.deleted",
  },
  async ({ event, step }) => {
    await step.run("delete-organization-user-settings", async () => {
      const userId = event.data.data.public_user_data.user_id
      const orgId = event.data.data.organization.id

      await deleteOrganizationUserSettings({
        userId,
        organizationId: orgId,
      })
    })
  }
)
