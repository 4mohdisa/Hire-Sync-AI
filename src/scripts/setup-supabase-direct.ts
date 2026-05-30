import { Client } from 'pg'
import fs from 'fs'
import path from 'path'
import { env } from '@/data/env/server'

async function setupSupabaseDatabase() {
  const client = new Client({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('🚀 Connecting to Supabase database...')
    await client.connect()
    console.log('✅ Connected to database')

    // Read the SQL migration file
    const sqlPath = path.join(process.cwd(), 'src/drizzle/migrate-to-supabase.sql')
    const migrationSQL = fs.readFileSync(sqlPath, 'utf8')

    console.log('📝 Executing migration SQL...')
    
    // Execute the entire SQL script at once
    await client.query(migrationSQL)
    
    console.log('🎉 Database setup completed successfully!')
    console.log('\n📋 What was created:')
    console.log('• Users table with UUID primary keys')
    console.log('• Job listings table (user-owned)')
    console.log('• Job applications table')
    console.log('• User resumes table')
    console.log('• User notification settings table')
    console.log('• Row Level Security (RLS) policies')
    console.log('• Database indexes for performance')
    console.log('• Auto-trigger for user profile creation')
    
    console.log('1. Verify tables in your Supabase dashboard')
    console.log('2. Test user registration and authentication')
    console.log('3. Check RLS policies are working')

  } catch (error) {
    console.error('❌ Error setting up database:', error)
    
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      if ('code' in error) {
        console.error('Error code:', error.code)
      }
    }
    
    process.exit(1)
  } finally {
    await client.end()
    console.log('🔌 Database connection closed')
  }
}

// Run the setup
setupSupabaseDatabase()