import { ReactNode } from "react"
import { SettingsNavTabs } from "@/features/users/components/SettingsNavTabs"

export default function UserSettingsLayout({ 
  children 
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your account preferences
          </p>
        </div>
        <SettingsNavTabs />
      </div>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}