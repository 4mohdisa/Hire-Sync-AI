"use client"

import { useSupabase } from "@/services/supabase/components/SupabaseProvider"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer"

type Resume = {
  id: string
  file_name: string
  url: string
  ai_summary?: string | null
  is_primary: boolean
  created_at: string
}

export function ResumesListHybridWrapper() {
  const { user: clientUser, loading } = useSupabase()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoadingResumes, setIsLoadingResumes] = useState(false)

  // Fetch resumes when we have a user
  useEffect(() => {
    if (clientUser?.id) {
      fetchResumes()
    }
  }, [clientUser?.id])

  const fetchResumes = async () => {
    setIsLoadingResumes(true)
    try {
      
      const response = await fetch(`/api/user/resumes`)
      if (!response.ok) {
        throw new Error('Failed to fetch resumes')
      }
      
      const data = await response.json()
      setResumes(data.resumes || [])
    } catch {
      setResumes([])
    } finally {
      setIsLoadingResumes(false)
    }
  }

  // Show loading while client auth is loading
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (!clientUser) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Please sign in to access your resumes.</p>
          <Button asChild>
            <Link href="/auth/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (isLoadingResumes) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (resumes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-600">No resumes uploaded yet. Upload your first resume above.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold">Your Resumes ({resumes.length})</h2>
      {resumes.map((resume) => (
        <Card key={resume.id} className={resume.is_primary ? "border-blue-500 bg-blue-50/30" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{resume.file_name}</CardTitle>
                {resume.is_primary && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Primary
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview
                  </Link>
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Uploaded: {new Date(resume.created_at).toLocaleDateString()}
            </p>
          </CardHeader>
          {resume.ai_summary && (
            <CardContent className="pt-0">
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-2">AI Summary</h4>
                <div className="text-sm text-gray-700">
                  <MarkdownRenderer source={resume.ai_summary} />
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}