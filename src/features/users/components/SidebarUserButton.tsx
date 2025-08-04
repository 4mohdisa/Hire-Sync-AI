import { Suspense } from "react"
import { SidebarUserButtonClient } from "./_SidebarUserButtonClient"
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
        <SidebarMenuButton asChild>
          <a href="/auth/sign-in">
            <UserIcon />
            <span>Sign In</span>
          </a>
        </SidebarMenuButton>
      )
    }

    // Transform Supabase user to expected format
    const transformedUser = {
      name: user.user_metadata?.name || user.email?.split('@')[0] || "User",
      email: user.email || "",
      imageUrl: user.user_metadata?.avatar_url || ""
    };

    return <SidebarUserButtonClient user={transformedUser} />
  } catch (error) {
    console.error("Error in SidebarUserSuspense:", error);
    // Return a fallback UI when there's an error
    return <SidebarUserFallback />
  }
}
