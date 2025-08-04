import { getCurrentUser } from './auth'
import { db } from '@/drizzle/db'
import { UserTable } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function getCurrentUserProfile() {
  const { user } = await getCurrentUser()
  
  if (!user) {
    return { user: null, profile: null }
  }

  // Get user profile from database
  const profile = await db.query.UserTable.findFirst({
    where: eq(UserTable.id, user.id)
  })

  return { user, profile }
}

export async function requireUserProfile() {
  const { user, profile } = await getCurrentUserProfile()
  
  if (!user || !profile) {
    throw new Error('User authentication required')
  }
  
  return { user, profile }
}

// Simplified permission system without organizations
export async function hasUserPermission(action: string): Promise<boolean> {
  const { user } = await getCurrentUser()
  
  if (!user) {
    return false
  }
  
  // For now, all authenticated users have all permissions
  // You can implement role-based permissions here later
  return true
}

// Organization-related functions simplified to user-based
export async function getCurrentUserAsOrganization() {
  const { user, profile } = await getCurrentUserProfile()
  
  if (!user || !profile) {
    return { userId: null, orgId: null }
  }
  
  // Treat the user as their own "organization"
  return { 
    userId: user.id, 
    orgId: user.id // Use user ID as org ID for compatibility
  }
}

export async function requireCurrentUserAsOrganization() {
  const result = await getCurrentUserAsOrganization()
  
  if (!result.userId) {
    throw new Error('User authentication required')
  }
  
  return result
}