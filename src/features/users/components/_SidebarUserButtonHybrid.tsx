"use client"

import { useEffect, useState } from "react"
import { SidebarUserButtonClient } from "./_SidebarUserButtonClient"
import { useSupabase } from "@/services/supabase/components/SupabaseProvider"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { UserIcon } from "lucide-react"
import { User } from '@supabase/supabase-js'

type TransformedUser = {
  name: string
  imageUrl: string
  email: string
}

interface SidebarUserButtonHybridProps {
  serverUser: User | null
}

export function SidebarUserButtonHybrid({ serverUser }: SidebarUserButtonHybridProps) {
  const { user: clientUser, loading } = useSupabase()
  const [displayUser, setDisplayUser] = useState<TransformedUser | null>(null)

  useEffect(() => {
    // Priority: Use server user if available, otherwise use client user
    const effectiveUser = serverUser || clientUser

    if (effectiveUser) {
      const transformedUser: TransformedUser = {
        name: effectiveUser.user_metadata?.name || effectiveUser.email?.split('@')[0] || "User",
        email: effectiveUser.email || "",
        imageUrl: effectiveUser.user_metadata?.avatar_url || ""
      }

      setDisplayUser(transformedUser)
    } else {
      setDisplayUser(null)
    }
  }, [serverUser, clientUser, loading])

  // Show loading state while client is loading and no server user
  if (loading && !serverUser) {
    return (
      <SidebarMenuButton>
        <UserIcon />
        <span>Loading...</span>
      </SidebarMenuButton>
    )
  }

  // Show user profile if we have a display user
  if (displayUser) {
    return <SidebarUserButtonClient user={displayUser} />
  }

  // Show sign in button as fallback
  return (
    <SidebarMenuButton asChild>
      <a href="/auth/sign-in">
        <UserIcon />
        <span>Sign In</span>
      </a>
    </SidebarMenuButton>
  )
}