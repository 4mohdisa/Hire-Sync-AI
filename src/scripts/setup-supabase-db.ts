import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { env } from '@/data/env/server'

async function setupSupabaseDatabase() {
  try {
    console.log('🚀 Setting up Supabase database...')
    
    // Create admin client for database operations
    const supabaseAdmin = createClient(
      env.PROJECT_URL,
      env.SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    // Read the SQL migration file
    const sqlPath = path.join(process.cwd(), 'src/drizzle/migrate-to-supabase.sql')
    const migrationSQL = fs.readFileSync(sqlPath, 'utf8')
    
    // Clean up the SQL and split into statements
    const cleanSQL = migrationSQL
      .replace(/--.*$/gm, '') // Remove comments
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim()
    
    // Split by semicolon and filter out empty statements
    const statements = cleanSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0 && !statement.match(/^\s*$/))
    
    console.log(`📝 Executing ${statements.length} SQL statements...`)
    
    // Execute each statement using raw SQL
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (!statement || statement.trim().length === 0) continue
      
      console.log(`⚡ Executing statement ${i + 1}/${statements.length}`)
      
      try {
        const { data, error } = await supabaseAdmin.rpc('exec_sql', {
          sql: statement
        })
        
        if (error) {
          console.error(`❌ Error executing statement ${i + 1}:`, error)
          console.error('Statement:', statement.substring(0, 200) + '...')
          // Continue with other statements instead of failing completely
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`)
        }
      } catch (err) {
        console.error(`❌ Exception executing statement ${i + 1}:`, err)
        console.error('Statement:', statement.substring(0, 200) + '...')
      }
    }
    
    console.log('🎉 Database setup completed!')
    console.log('\n📋 Next steps:')
    console.log('1. Verify tables were created in your Supabase dashboard')
    console.log('2. Check that RLS policies are enabled')
    console.log('3. Test authentication flow')
    
  } catch (error) {
    console.error('❌ Error setting up database:', error)
    process.exit(1)
  }
}

// Run the setup
setupSupabaseDatabase()