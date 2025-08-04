import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function verifyMigration() {
  // Check for required environment variables
  const requiredVars = ['NEXT_PUBLIC_SUPABASE_URL', 'SERVICE_ROLE_KEY']
  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing)
    process.exit(1)
  }

  // Create Supabase admin client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  try {
    console.log('🔍 Verifying migrated data in Supabase...\n')

    // Check users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true })

    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message)
    } else {
      console.log('👥 Users in database:')
      users?.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.name} (${user.email})`)
        console.log(`     ID: ${user.id}`)
        console.log(`     Created: ${new Date(user.created_at).toLocaleDateString()}`)
        console.log('')
      })
    }

    // Check job listings
    const { data: jobListings, error: jobListingsError } = await supabase
      .from('job_listings')
      .select(`
        *,
        user:users(name, email)
      `)
      .order('created_at', { ascending: true })

    if (jobListingsError) {
      console.error('❌ Error fetching job listings:', jobListingsError.message)
    } else {
      console.log('💼 Job listings in database:')
      jobListings?.forEach((job, index) => {
        console.log(`  ${index + 1}. "${job.title}"`)
        console.log(`     Owner: ${job.user?.name} (${job.user?.email})`)
        console.log(`     Location: ${job.city}, ${job.state_abbreviation}`)
        console.log(`     Salary: $${job.wage?.toLocaleString()} ${job.wage_interval}`)
        console.log(`     Type: ${job.type}, ${job.experience_level}, ${job.location_requirement}`)
        console.log(`     Status: ${job.status}`)
        console.log(`     Posted: ${job.posted_at ? new Date(job.posted_at).toLocaleDateString() : 'Not posted'}`)
        console.log('')
      })
    }

    // Check user notification settings
    const { data: notificationSettings, error: notificationError } = await supabase
      .from('user_notification_settings')
      .select(`
        *,
        user:users(name, email)
      `)

    if (notificationError) {
      console.error('❌ Error fetching notification settings:', notificationError.message)
    } else {
      console.log('🔔 User notification settings:')
      notificationSettings?.forEach((setting, index) => {
        console.log(`  ${index + 1}. ${setting.user?.name}`)
        console.log(`     Email notifications: ${setting.email_notifications ? '✅' : '❌'}`)
        console.log(`     Application updates: ${setting.application_updates ? '✅' : '❌'}`)
        console.log(`     New job alerts: ${setting.new_job_alerts ? '✅' : '❌'}`)
        console.log('')
      })
    }

    // Summary
    console.log('📊 Migration Summary:')
    console.log(`• Total users: ${users?.length || 0}`)
    console.log(`• Total job listings: ${jobListings?.length || 0}`)
    console.log(`• Total notification settings: ${notificationSettings?.length || 0}`)
    
    if (users?.length === 4 && jobListings?.length === 3 && notificationSettings?.length === 4) {
      console.log('\n✅ Migration verification successful! All data looks good.')
    } else {
      console.log('\n⚠️ Some data might be missing. Check the results above.')
    }

  } catch (error: any) {
    console.error('❌ Verification failed:', error.message || error)
    process.exit(1)
  }
}

// Run the verification
verifyMigration()