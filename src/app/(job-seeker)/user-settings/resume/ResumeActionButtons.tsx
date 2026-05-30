"use client"

import { Button } from "@/components/ui/button"
import { Trash2, Star } from "lucide-react"
import { deleteResumeAction, setPrimaryResumeAction } from "@/features/users/actions/resumeActions"
import { useTransition } from "react"
import { toast } from "sonner"

interface DeleteResumeButtonProps {
  resumeId: string
  isPrimary?: boolean // Optional since we don't use it currently
}

interface SetPrimaryResumeButtonProps {
  resumeId: string
  isPrimary: boolean
}

export function DeleteResumeButton({ resumeId }: DeleteResumeButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this resume? This action cannot be undone.")) {
      startTransition(async () => {
        const result = await deleteResumeAction(resumeId)
        if (result.success) {
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
      })
    }
  }

  return (
    <Button
      onClick={handleDelete}
      disabled={isPending}
      size="sm"
      variant="outline"
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4" />
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  )
}

export function SetPrimaryResumeButton({ resumeId, isPrimary }: SetPrimaryResumeButtonProps) {
  const [isPending, startTransition] = useTransition()

  if (isPrimary) {
    return null // Don't show button for already primary resume
  }

  const handleSetPrimary = () => {
    startTransition(async () => {
      const result = await setPrimaryResumeAction(resumeId)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Button
      onClick={handleSetPrimary}
      disabled={isPending}
      size="sm"
      variant="outline"
      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
    >
      <Star className="w-4 h-4" />
      {isPending ? "Setting..." : "Set Primary"}
    </Button>
  )
}