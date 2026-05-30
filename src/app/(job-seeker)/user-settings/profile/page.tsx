import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Card, CardContent } from "@/components/ui/card"
import { ProfileForm } from "@/features/users/components/ProfileForm"
import { ProfileFormClientWrapper } from "@/features/users/components/ProfileFormClientWrapper"
import { getCurrentUser } from "@/services/supabase/auth"
import { Suspense } from "react"
import { User } from '@supabase/supabase-js'

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      <Card>
        <CardContent>
          <Suspense fallback={<LoadingSpinner />}>
            <ProfilePageContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

async function ProfilePageContent() {
  // Try to get user from server-side
  const { user: serverUser } = await getCurrentUser()
  

  // If no server user, use client-side hybrid approach
  if (!serverUser) {
    return <ProfileFormHybrid serverUser={null} />
  }

  return <ProfileForm user={serverUser} />
}

// Client component that uses hybrid authentication  
function ProfileFormHybrid({ serverUser }: { serverUser: User | null }) {
  return <ProfileFormClientWrapper serverUser={serverUser} />
}