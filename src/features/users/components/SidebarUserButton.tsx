import { Suspense } from "react"
import { SidebarUserButtonHybrid } from "./_SidebarUserButtonHybrid"
import { getCurrentUser } from "@/services/supabase/auth"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { UserIcon } from "lucide-react"

export function SidebarUserButton() {
  return (
    <Suspense fallback={<SidebarUserFallback />}>
      <SidebarUserSuspense />
    </Suspense>
  )
}

// Fallback component when suspense is loading or errors occur
function SidebarUserFallback() {
  // Provide a simple placeholder when loading or errors occur
  return (
    <SidebarMenuButton>
      <UserIcon />
      <span>Guest User</span>
    </SidebarMenuButton>
  )
}

async function SidebarUserSuspense() {
  try {
    const { user } = await getCurrentUser();

    if (user == null) {
      return (
        <a href="/auth/sign-in">
          <SidebarMenuButton>
            <UserIcon />
            <span>Sign In</span>
          </SidebarMenuButton>
        </a>
      )
    }

    return <SidebarUserButtonHybrid serverUser={user} />
  } catch (error) {
    console.error("Error in SidebarUserSuspense:", error);
    // Return a fallback UI when there's an error
    return <SidebarUserFallback />
  }
}
