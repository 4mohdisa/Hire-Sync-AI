import { ApplicationStage } from "@/drizzle/schema"
import {
  CircleHelpIcon,
  CircleXIcon,
  HandshakeIcon,
  SpeechIcon,
} from "lucide-react"
import { ComponentPropsWithRef } from "react"

export function StageIcon({
  stage,
  ...props
}: { stage: ApplicationStage } & ComponentPropsWithRef<typeof CircleHelpIcon>) {
  const Icon = getIcon(stage)
  return <Icon {...props} />
}

function getIcon(stage: ApplicationStage) {
  switch (stage) {
    case "applied":
      return CircleHelpIcon
    case "phone-screen":
      return SpeechIcon
    case "interview":
      return SpeechIcon
    case "offer":
      return HandshakeIcon
    case "rejected":
      return CircleXIcon
    default:
      throw new Error(`Unknown application stage: ${stage satisfies never}`)
  }
}
