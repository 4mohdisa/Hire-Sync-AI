"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  UserIcon, 
  BellIcon, 
  FileTextIcon,
  BrainIcon
} from "lucide-react"

const settingsTabs = [
  {
    href: "/user-settings/profile",
    label: "Profile", 
    icon: UserIcon
  },
  {
    href: "/user-settings/resume",
    label: "Resume",
    icon: FileTextIcon
  },
  {
    href: "/user-settings/notifications",
    label: "Notifications", 
    icon: BellIcon
  },
  {
    href: "/user-settings/ai-agent",
    label: "AI Agent",
    icon: BrainIcon
  }
]

export function SettingsNavTabs() {
  const pathname = usePathname()

  return (
    <nav className="flex border-b border-gray-200 bg-white px-6">
      {settingsTabs.map((tab) => {
        const Icon = tab.icon
        const isActive = pathname === tab.href
        
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              isActive
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            <Icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}