import { createServerSupabaseClientForAuth, supabaseAdmin } from './server'
import { db } from '@/drizzle/db'
import { OrganizationTable } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function getCurrentOrganization(): Promise<{
  organizationId: string | null
  organization: typeof OrganizationTable.$inferSelect | null
}> {
  try {
    // Get the authenticated user from Supabase Auth
    const supabase = await createServerSupabaseClientForAuth()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return { organizationId: null, organization: null }
    }
    
    // Check if this is an organization account by looking for organization with this email
    const organization = await db.query.OrganizationTable.findFirst({
      where: eq(OrganizationTable.email, user.email!)
    })
    
    if (!organization) {
      return { organizationId: null, organization: null }
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ getCurrentOrganization success for:', organization.company_name)
    }
    
    return {
      organizationId: organization.id,
      organization
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('getCurrentOrganization error:', error)
    }
    
    return { organizationId: null, organization: null }
  }
}

export async function requireOrganizationAuth() {
  const { organization, organizationId } = await getCurrentOrganization()
  
  if (!organization || !organizationId) {
    throw new Error('Organization authentication required')
  }
  
  return { organization, organizationId }
}

export async function createOrganizationUser(data: {
  email: string
  password: string
  company_name: string
  logo_url?: string
  website_url?: string
}) {
  try {
    // 1. Create Supabase Auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: false, // Will need email confirmation
      user_metadata: {
        account_type: 'organization',
        company_name: data.company_name
      }
    })
    
    if (authError) {
      throw new Error(`Authentication error: ${authError.message}`)
    }
    
    // 2. Create organization record in database
    const [organization] = await db.insert(OrganizationTable).values({
      email: data.email,
      company_name: data.company_name,
      logo_url: data.logo_url,
      website_url: data.website_url,
      is_verified: false // Will be verified via email
    }).returning()
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Created organization:', organization.company_name)
    }
    
    return {
      success: true,
      organization,
      user: authData.user
    }
    
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ createOrganizationUser error:', error)
    }
    
    throw error
  }
}

export async function getOrganizationById(id: string) {
  try {
    const organization = await db.query.OrganizationTable.findFirst({
      where: eq(OrganizationTable.id, id)
    })
    
    return organization
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('getOrganizationById error:', error)
    }
    
    return null
  }
}

// Utility function to check if current session is organization vs individual user
export async function getAccountType(): Promise<'user' | 'organization' | null> {
  try {
    const supabase = await createServerSupabaseClientForAuth()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }
    
    // Check user metadata for account type
    const accountType = user.user_metadata?.account_type
    if (accountType === 'organization') {
      return 'organization'
    }
    
    // Also check if organization exists with this email
    const organization = await db.query.OrganizationTable.findFirst({
      where: eq(OrganizationTable.email, user.email!)
    })
    
    return organization ? 'organization' : 'user'
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('getAccountType error:', error)
    }
    
    return null
  }
}