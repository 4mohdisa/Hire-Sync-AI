import { AppSidebar } from "@/components/sidebar/AppSidebar"
import { SidebarNavMenuGroup } from "@/components/sidebar/SidebarNavMenuGroup"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { db } from "@/drizzle/db"
import {
  JobListingApplicationTable,
  JobListingStatus,
  JobListingTable,
} from "@/drizzle/schema"
import { getJobListingApplicationJobListingTag } from "@/features/jobListingApplications/db/cache/jobListingApplications"
import { getJobListingUserTag } from "@/features/jobListings/db/cache/jobListings"
import { sortJobListingsByStatus } from "@/features/jobListings/lib/utils"
import { getCurrentUser } from "@/services/supabase/auth"
import { count, desc, eq } from "drizzle-orm"
import { ClipboardListIcon, PlusIcon } from "lucide-react"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ReactNode, Suspense } from "react"
import { JobListingMenuGroup } from "./_JobListingMenugroup"

export default function EmployerLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <LayoutSuspense>{children}</LayoutSuspense>
    </Suspense>
  )
}

async function LayoutSuspense({ children }: { children: ReactNode }) {
  const { userId } = await getCurrentUser()
  if (userId == null) return redirect("/auth/sign-in")

  return (
    <AppSidebar
      content={
        <>
          <SidebarGroup>
            <SidebarGroupLabel>Job Listings</SidebarGroupLabel>
            <SidebarGroupAction title="Add Job Listing" asChild>
              <Link href="/employer/job-listings/new">
                <PlusIcon /> <span className="sr-only">Add Job Listing</span>
              </Link>
            </SidebarGroupAction>
            <SidebarGroupContent className="group-data-[state=collapsed]:hidden">
              <Suspense>
                <JobListingMenu userId={userId} />
              </Suspense>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarNavMenuGroup
            className="mt-auto"
            items={[
              { href: "/", icon: <ClipboardListIcon />, label: "Hire-Sync AI" },
            ]}
          />
        </>
      }
      footerButton={null}
    >
      {children}
    </AppSidebar>
  )
}

async function JobListingMenu({ userId }: { userId: string }) {
  const jobListings = await getJobListings(userId)

  if (jobListings.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/employer/job-listings/new">
              <PlusIcon />
              <span>Create your first job listing</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return Object.entries(Object.groupBy(jobListings, j => j.status))
    .sort(([a], [b]) => {
      return sortJobListingsByStatus(
        a as JobListingStatus,
        b as JobListingStatus
      )
    })
    .map(([status, jobListings]) => (
      <JobListingMenuGroup
        key={status}
        status={status as JobListingStatus}
        jobListings={jobListings}
      />
    ))
}

async function getJobListings(userId: string) {
  "use cache"
  cacheTag(getJobListingUserTag(userId))

  const data = await db
    .select({
      id: JobListingTable.id,
      title: JobListingTable.title,
      status: JobListingTable.status,
      applicationCount: count(JobListingApplicationTable.userId),
    })
    .from(JobListingTable)
    .where(eq(JobListingTable.user_id, userId))
    .leftJoin(
      JobListingApplicationTable,
      eq(JobListingTable.id, JobListingApplicationTable.jobListingId)
    )
    .groupBy(JobListingApplicationTable.jobListingId, JobListingTable.id)
    .orderBy(desc(JobListingTable.created_at))

  data.forEach(jobListing => {
    cacheTag(getJobListingApplicationJobListingTag(jobListing.id))
  })

  return data
}
