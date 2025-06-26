import { Suspense } from "react"
import { SidebarUserButtonClient } from "./_SidebarUserButtonClient"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth"
import { SignOutButton } from "@/services/clerk/components/AuthButtons"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { LogOutIcon } from "lucide-react"

export function SidebarUserButton() {
  return (
    <Suspense>
      <SidebarUserSuspense />
    </Suspense>
  )
}

async function SidebarUserSuspense() {
  const { user } = await getCurrentUser({ allData: true });

  const fallbackUser = user || {
    name: "Test User",
    email: "test@example.com",
    imageUrl: ""
  };

  if (user == null) {
    return (
      <SignOutButton>
        <SidebarMenuButton>
          <LogOutIcon />
          <span>Log Out</span>
        </SidebarMenuButton>
      </SignOutButton>
    )
  }

  return <SidebarUserButtonClient user={fallbackUser} />
}
