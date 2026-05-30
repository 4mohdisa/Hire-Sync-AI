"use client"

import { useSupabase } from "@/services/supabase/components/SupabaseProvider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer"
import { useEffect, useState } from "react"
import { UserResumeTable } from "@/drizzle/schema"

type UserResume = typeof UserResumeTable.$inferSelect

export function AISummaryHybridWrapper() {
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
      
      // This would typically call an API to get user resume with AI summary
      // For now, we'll return null (no resume with AI summary found)
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

  // Don't render if no resume with AI summary found
  if (!userResume || !userResume.ai_summary) {
    return null
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>AI Summary</CardTitle>
        <CardDescription>
          This is an AI-generated summary of your resume. This is used by
          employers to quickly understand your qualifications and experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MarkdownRenderer source={userResume.ai_summary} />
      </CardContent>
    </Card>
  )
}