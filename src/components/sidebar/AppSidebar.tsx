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
import { SignedIn } from "@/services/clerk/components/SignInStatus"
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
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="HireSync AI"
                width={32}
                height={32}
                className="shrink-0"
              />
              <span className="text-xl text-nowrap group-data-[collapsible=icon]:hidden">HireSync AI</span>
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
