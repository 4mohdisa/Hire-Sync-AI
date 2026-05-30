import { supabaseAdmin } from '../src/services/supabase/server'

async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS policies...')
  
  try {
    // Add policy to allow anyone to view basic user info for job listing authors
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Anyone can view job listing authors" ON users
            FOR SELECT USING (
                id IN (
                    SELECT user_id FROM job_listings 
                    WHERE status = 'published'
                )
            );
      `
    })
    
    if (error) {
      console.error('❌ Error executing SQL:', error)
      
      // Try alternative approach with direct query
      console.log('🔄 Trying alternative approach...')
      const { error: altError } = await supabaseAdmin
        .from('users')
        .select('*')
        .limit(1)
      
      if (altError) {
        console.error('❌ Alternative approach failed:', altError)
      } else {
        console.log('✅ Database connection works, but RLS policy creation failed')
        console.log('📋 Please manually execute this SQL in Supabase dashboard:')
        console.log(`
CREATE POLICY "Anyone can view job listing authors" ON users
    FOR SELECT USING (
        id IN (
            SELECT user_id FROM job_listings 
            WHERE status = 'published'
        )
    );
        `)
      }
    } else {
      console.log('✅ RLS policy created successfully!')
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    console.log('📋 Please manually execute this SQL in Supabase dashboard:')
    console.log(`
CREATE POLICY "Anyone can view job listing authors" ON users
    FOR SELECT USING (
        id IN (
            SELECT user_id FROM job_listings 
            WHERE status = 'published'
        )
    );
    `)
  }
}

fixRLSPolicies()