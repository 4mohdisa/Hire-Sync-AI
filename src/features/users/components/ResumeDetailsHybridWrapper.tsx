"use client"

import { useSupabase } from "@/services/supabase/components/SupabaseProvider"
import { Button } from "@/components/ui/button"
import { CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"
import { UserResumeTable } from "@/drizzle/schema"

type UserResume = typeof UserResumeTable.$inferSelect

export function ResumeDetailsHybridWrapper() {
  const { user: clientUser, loading } = useSupabase()
  const [userResume, setUserResume] = useState<UserResume | null>(null)
  const [isLoadingResume, setIsLoadingResume] = useState(false)

  // Fetch user resume when we have a user
  useEffect(() => {
    if (clientUser?.id && !userResume) {
      fetchUserResume()
    }
  }, [clientUser?.id, userResume])

  const fetchUserResume = async () => {
    setIsLoadingResume(true)
    try {
      
      // This would typically call an API to get user resume
      // For now, we'll return null (no resume found)
      setUserResume(null)
      
    } catch {
      setUserResume(null)
    } finally {
      setIsLoadingResume(false)
    }
  }

  // Don't render anything while loading or if no user
  if (loading || !clientUser || isLoadingResume) {
    return null
  }

  // Don't render if no resume found
  if (!userResume) {
    return null
  }

  return (
    <CardFooter>
      <Button asChild>
        <Link
          href={userResume.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Resume
        </Link>
      </Button>
    </CardFooter>
  )
}