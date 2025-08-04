import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SignedIn } from "@/services/supabase/components/AuthStatus"
import { AppSidebarClient } from "./_AppSidebarClient"
import { ReactNode } from "react"
import Image from "next/image"

export function AppSidebar({
  children,
  content,
  footerButton,
}: {
  children: ReactNode
  content: ReactNode
  footerButton: ReactNode
}) {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex-row">
            <SidebarTrigger />
            <div className="flex items-center gap-2 px-2 py-1">
              <Image
                src="/logo.png"
                alt="HireSync AI"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
          </SidebarHeader>
          <SidebarContent>{content}</SidebarContent>
          <SignedIn>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>{footerButton}</SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SignedIn>
        </Sidebar>
        <main className="flex-1">{children}</main>
      </AppSidebarClient>
    </SidebarProvider>
  )
}
