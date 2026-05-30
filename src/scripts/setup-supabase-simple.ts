import { Client } from 'pg'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function setupSupabaseDatabase() {
  // Check for required environment variables
  const requiredVars = ['DATABASE_URL']
  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing)
    console.error('Please set the following in your .env file:')
    missing.forEach(varName => {
      console.error(`- ${varName}`)
    })
    process.exit(1)
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
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
        
        // Provide helpful error messages for common issues
        if (error.code === 'ENOTFOUND') {
          console.error('\n💡 Tip: Check your DATABASE_URL is correct')
        } else if (error.code === '28P01') {
          console.error('\n💡 Tip: Check your database password is correct')
        } else if (error.code === '3D000') {
          console.error('\n💡 Tip: Check your database name is correct')
        }
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