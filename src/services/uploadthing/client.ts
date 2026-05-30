import { env } from "@/data/env/server"
import { UTApi } from "uploadthing/server"

// Only create UTApi if token is available
export const uploadthing = env.UPLOADTHING_TOKEN 
  ? new UTApi({ token: env.UPLOADTHING_TOKEN })
  : new UTApi() // This will use UPLOADTHING_TOKEN env var automatically
