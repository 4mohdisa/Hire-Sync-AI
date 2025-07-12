import { JobBoardSidebar } from "../_shared/JobBoardSidebar"
import { Suspense } from "react"

export default function JobBoardSidebarPage() {
  return (
    <Suspense fallback={<div>Loading filters...</div>}>
      <JobBoardSidebar />
    </Suspense>
  )
}
