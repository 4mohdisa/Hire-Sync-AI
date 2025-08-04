'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/services/supabase/client'
import { useEffect, useState } from 'react'
import { useSupabase } from '@/services/supabase/components/SupabaseProvider'

export default function SignUpPage() {
  const { user } = useSupabase()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (user) {
      window.location.href = '/'
    }
  }, [user])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img
            className="mx-auto h-16 w-auto"
            src="/logo.png"
            alt="HireSync"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join HireSync AI and find your dream job
          </p>
        </div>
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <Auth
            supabaseClient={supabase}
            view="sign_up"
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                    borderColorStronger: '#e5e7eb',
                    inputBackground: 'white',
                    inputBorder: '#d1d5db',
                    inputBorderFocus: '#2563eb',
                    inputBorderHover: '#9ca3af'
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px'
                  },
                  radii: {
                    borderRadiusButton: '6px',
                    buttonBorderRadius: '6px',
                    inputBorderRadius: '6px'
                  }
                }
              }
            }}
            providers={[]} // No third-party providers, email/password only
          />
        </div>
      </div>
    </div>
  )
}