import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// Pure Supabase connection - no Docker/local fallbacks
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is required. ' +
    'Please set it to your Supabase database URL in your .env file.'
  )
}

const connectionString = process.env.DATABASE_URL

// Create the database client - only Supabase connection
const client = postgres(connectionString, {
  prepare: false,
})

// Export the database client
export const db = drizzle(client, { schema })
