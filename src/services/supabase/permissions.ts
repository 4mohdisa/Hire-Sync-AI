import { getCurrentUser } from './auth'

// Simplified permission system without organizations
// All authenticated users have all permissions for now
const ALL_PERMISSIONS = [
  'org:job_listings:create',
  'org:job_listings:read',
  'org:job_listings:update',
  'org:job_listings:delete',
  'org:job_listings:change_status',
  'org:job_listing_applications:read',
  'org:job_listing_applications:change_rating',
  'org:job_listing_applications:change_stage',
] as const

export type Permission = typeof ALL_PERMISSIONS[number]

export async function hasOrgUserPermission(permission: Permission): Promise<boolean> {
  const { user } = await getCurrentUser()
  
  if (!user) {
    return false
  }
  
  // For now, all authenticated users have all permissions
  // You can implement role-based permissions here later
  return true
}

export async function requireOrgUserPermission(permission: Permission): Promise<void> {
  const hasPermission = await hasOrgUserPermission(permission)
  
  if (!hasPermission) {
    throw new Error(`Permission denied: ${permission}`)
  }
}

// Legacy compatibility
export { hasOrgUserPermission as hasUserPermission }