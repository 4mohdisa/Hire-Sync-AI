"use client"

import { UploadDropzone } from "@/services/uploadthing/components/UploadThing"
import { useRouter } from "next/navigation"

export function DropzoneClient() {
  const router = useRouter()

  return (
    <UploadDropzone
      endpoint="resumeUploader"
      onClientUploadComplete={(res) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('📤 Upload completed:', res)
          console.log('🔄 Refreshing resume page...')
        }
        
        // Force refresh to show updated resume list
        router.refresh()
        
        // Additional refresh after a short delay to ensure cache is cleared
        setTimeout(() => {
          if (process.env.NODE_ENV === 'development') {
            console.log('🔄 Second refresh to ensure cache clear')
          }
          router.refresh()
        }, 500)
      }}
      onUploadError={(error) => {
        console.error("Upload error:", error)
      }}
    />
  )
}
