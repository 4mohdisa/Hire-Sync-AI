import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    // Project Configuration
    PROJECT_URL: z.string().optional().default("http://localhost:3000"),
    
    // Database Configuration (Supabase)
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required for Supabase connection"),
    
    // Supabase Configuration
    SUPABASE_URL: z.string().optional(),
    SUPABASE_ANON_KEY: z.string().optional(),
    SERVICE_ROLE_KEY: z.string().optional(),
    JWT_SECRET: z.string().optional(),
    
    // External Services
    UPLOADTHING_TOKEN: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    SERVER_URL: z.string().optional(),
  },
  // Pass environment variables through
  experimental__runtimeEnv: {
    PROJECT_URL: process.env.PROJECT_URL || "http://localhost:3000",
    DATABASE_URL: process.env.DATABASE_URL,
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SERVICE_ROLE_KEY: process.env.SERVICE_ROLE_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    SERVER_URL: process.env.SERVER_URL,
  },
  emptyStringAsUndefined: true,
})
