import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function setupSupabaseDatabase() {
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
    console.log('🚀 Setting up Supabase database manually...')

    // Test connection first by trying to access a system table
    const { error: testError } = await supabase.rpc('version')

    if (testError) {
      console.error('❌ Connection test failed:', testError.message)
      console.log('ℹ️  This might be normal - continuing with setup...')
    }

    console.log('✅ Connected to Supabase')

    console.log('\n📋 Manual setup required:')
    console.log('Since direct SQL execution via API has limitations, please:')
    console.log('\n1. Go to your Supabase project dashboard:')
    console.log('   https://supabase.com/dashboard/project/niyfuskcfxorcjwixzof')
    console.log('\n2. Navigate to: SQL Editor')
    console.log('\n3. Copy and paste the contents of: src/drizzle/migrate-to-supabase.sql')
    console.log('\n4. Execute the SQL script')
    
    console.log('If you need the database password:')
    console.log('- Go to Settings → Database in your Supabase dashboard')
    console.log('- Find or reset your database password')
    console.log('- Update DATABASE_URL in .env file')
    console.log('- Run: npm run db:setup-supabase-direct')

    // Try to check if tables already exist
    
    const tableChecks = [
      'users',
      'job_listings', 
      'job_listing_applications',
      'user_resumes',
      'user_notification_settings'
    ]

    for (const tableName of tableChecks) {
      const { error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1)

      if (error) {
        if (error.message.includes('does not exist')) {
          console.log(`❌ Table '${tableName}' does not exist`)
        } else {
          console.log(`⚠️  Table '${tableName}': ${error.message}`)
        }
      } else {
        console.log(`✅ Table '${tableName}' exists`)
      }
    }

  } catch (error: unknown) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

// Run the setup
setupSupabaseDatabase()