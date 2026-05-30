import { db } from "@/drizzle/db"
import { OrganizationTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { revalidateTag } from "next/cache"

export async function insertOrganization(
  organization: typeof OrganizationTable.$inferInsert
) {
  try {
    const [newOrganization] = await db
      .insert(OrganizationTable)
      .values(organization)
      .returning()

    // Revalidate organization cache
    revalidateTag(`organization-${newOrganization.id}`)
    
    if (process.env.NODE_ENV === 'development') {
      console.log("Organization created successfully:", newOrganization.company_name)
    }
    
    return newOrganization
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error creating organization:", error)
    }
    throw error
  }
}

export async function updateOrganization(
  id: string,
  data: Partial<typeof OrganizationTable.$inferInsert>
) {
  try {
    const [updatedOrganization] = await db
      .update(OrganizationTable)
      .set({
        ...data,
        updated_at: new Date()
      })
      .where(eq(OrganizationTable.id, id))
      .returning()

    // Revalidate organization cache
    revalidateTag(`organization-${id}`)
    
    if (process.env.NODE_ENV === 'development') {
      console.log("Organization updated successfully:", updatedOrganization.company_name)
    }
    
    return updatedOrganization
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error updating organization:", error)
    }
    throw error
  }
}

export async function deleteOrganization(id: string) {
  try {
    const [deletedOrganization] = await db
      .delete(OrganizationTable)
      .where(eq(OrganizationTable.id, id))
      .returning()

    // Revalidate organization cache
    revalidateTag(`organization-${id}`)
    
    if (process.env.NODE_ENV === 'development') {
      console.log("Organization deleted successfully:", deletedOrganization.company_name)
    }
    
    return deletedOrganization
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error deleting organization:", error)
    }
    throw error
  }
}

export async function getOrganizationByEmail(email: string) {
  try {
    return await db.query.OrganizationTable.findFirst({
      where: eq(OrganizationTable.email, email)
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error getting organization by email:", error)
    }
    return null
  }
}

export async function getOrganizationWithJobListings(id: string) {
  "use cache"
  
  try {
    return await db.query.OrganizationTable.findFirst({
      where: eq(OrganizationTable.id, id),
      with: {
        jobListings: {
          orderBy: (jobListings, { desc }) => [desc(jobListings.created_at)],
        }
      }
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error getting organization with job listings:", error)
    }
    return null
  }
}