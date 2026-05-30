"use client"

import { useSupabase } from "@/services/supabase/components/SupabaseProvider"
import { ProfileForm } from "./ProfileForm"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { User } from '@supabase/supabase-js'

interface ProfileFormClientWrapperProps {
  serverUser: User | null
}

export function ProfileFormClientWrapper({ serverUser }: ProfileFormClientWrapperProps) {
  const { user: clientUser, loading } = useSupabase()

  // Show loading while client auth is loading and no server user
  if (loading && !serverUser) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  // Use server user if available, otherwise use client user
  const effectiveUser = serverUser || clientUser

  if (!effectiveUser) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Please sign in to access your profile.</p>
        <Button asChild>
          <Link href="/auth/sign-in">Sign In</Link>
        </Button>
      </div>
    )
  }

  return <ProfileForm user={effectiveUser} />
}