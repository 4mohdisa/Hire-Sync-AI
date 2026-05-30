import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
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
    console.log('🚀 Setting up Supabase database...')

    // Read the SQL migration file
    const sqlPath = path.join(process.cwd(), 'src/drizzle/migrate-to-supabase.sql')
    const migrationSQL = fs.readFileSync(sqlPath, 'utf8')

    console.log('📝 Executing migration SQL...')
    
    // Split SQL into individual statements and execute
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`🔄 Found ${statements.length} SQL statements to execute`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (!statement.trim()) continue

      console.log(`⚡ Executing statement ${i + 1}/${statements.length}`)
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        
        if (error) {
          // Some errors might be expected (like "already exists")
          if (error.message?.includes('already exists')) {
            console.log(`⚠️  Statement ${i + 1}: ${error.message} (continuing...)`)
          } else {
            console.error(`❌ Error in statement ${i + 1}:`, error.message)
            // Don't exit, continue with other statements
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`)
        }
      } catch (err: unknown) {
        console.error(`❌ Exception in statement ${i + 1}:`, err instanceof Error ? err.message : String(err))
        // Continue with other statements
      }
    }
    
    console.log('\n🎉 Database setup completed!')
    console.log('\n📋 What should be created:')
    console.log('• Users table with UUID primary keys')
    console.log('• Job listings table (user-owned)')
    console.log('• Job applications table')  
    console.log('• User resumes table')
    console.log('• User notification settings table')
    console.log('• Row Level Security (RLS) policies')
    console.log('• Database indexes for performance')
    console.log('• Auto-trigger for user profile creation')
    
    console.log('1. Verify tables in your Supabase dashboard')
    console.log('2. Test user registration flow')
    console.log('3. Check RLS policies are working')

  } catch (error: unknown) {
    console.error('❌ Error setting up database:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

// Run the setup
setupSupabaseDatabase()