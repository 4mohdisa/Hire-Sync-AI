"use client"

import { useSupabase } from "@/services/supabase/components/SupabaseProvider"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { NotificationsForm } from "./NotificationsForm"
import Link from "next/link"
import { useEffect, useState, useCallback } from "react"
import { UserNotificationSettingsTable } from "@/drizzle/schema"

type NotificationSettings = typeof UserNotificationSettingsTable.$inferSelect

export function NotificationsHybridWrapper() {
  const { user: clientUser, loading } = useSupabase()
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null)
  const [isLoadingSettings, setIsLoadingSettings] = useState(false)

  const fetchNotificationSettings = useCallback(async () => {
    setIsLoadingSettings(true)
    try {
      // This would typically call an API to get notification settings
      // For now, we'll provide default settings
      
      // Simulated default settings matching database schema
      const defaultSettings = {
        id: "temp-id",
        created_at: new Date(),
        updated_at: new Date(),
        user_id: clientUser?.id || "",
        email_notifications: true,
        application_updates: true,
        new_job_alerts: true,
      }
      
      setNotificationSettings(defaultSettings)
    } catch {
    } finally {
      setIsLoadingSettings(false)
    }
  }, [clientUser?.id])

  // Fetch notification settings when we have a user
  useEffect(() => {
    if (clientUser?.id && !notificationSettings) {
      fetchNotificationSettings()
    }
  }, [clientUser?.id, notificationSettings, fetchNotificationSettings])

  // Show loading while client auth is loading
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (!clientUser) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Please sign in to access notification settings.</p>
          <Button asChild>
            <Link href="/auth/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Notification Settings</h1>
      <Card>
        <CardContent>
          {isLoadingSettings ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : notificationSettings ? (
            <NotificationsForm notificationSettings={notificationSettings} />
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-600">Unable to load notification settings.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}