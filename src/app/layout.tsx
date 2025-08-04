import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import "@mdxeditor/editor/style.css"
import SupabaseProvider from "@/services/supabase/components/SupabaseProvider"
import { Toaster } from "@/components/ui/sonner"
import { UploadThingSSR } from "@/services/uploadthing/components/UploadThingSSR"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "HireSync AI - AI-Powered Job Board Platform",
  description: "Find your dream job with HireSync AI - a completely free job board platform featuring AI-powered job matching, resume analysis, and automated hiring workflows.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <SupabaseProvider>
          {children}
          <Toaster />
          <UploadThingSSR />
        </SupabaseProvider>
      </body>
    </html>
  )
}
