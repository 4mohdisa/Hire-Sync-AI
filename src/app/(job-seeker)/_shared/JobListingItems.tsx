import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { db } from "@/drizzle/db"
import {
  experienceLevels,
  JobListingTable,
  jobListingTypes,
  locationRequirements,
  UserTable,
} from "@/drizzle/schema"
import { convertSearchParamsToString } from "@/lib/convertSearchParamsToString"
import { cn } from "@/lib/utils"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { and, desc, eq, ilike, or, SQL } from "drizzle-orm"
import Link from "next/link"
import { Suspense } from "react"
import { differenceInDays } from "date-fns"
import { connection } from "next/server"
import { Badge } from "@/components/ui/badge"
import { JobListingBadges } from "@/features/jobListings/components/JobListingBadges"
import { z } from "zod"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { getJobListingGlobalTag } from "@/features/jobListings/db/cache/jobListings"
// Remove organization cache tags since we're user-based now

type Props = {
  searchParams: Promise<Record<string, string | string[]>>
  params?: Promise<{ jobListingId: string }>
}

const searchParamsSchema = z.object({
  title: z.string().optional().catch(undefined),
  city: z.string().optional().catch(undefined),
  state: z.string().optional().catch(undefined),
  experience: z.enum(experienceLevels).optional().catch(undefined),
  locationRequirement: z.enum(locationRequirements).optional().catch(undefined),
  type: z.enum(jobListingTypes).optional().catch(undefined),
  jobIds: z
    .union([z.string(), z.array(z.string())])
    .transform(v => (Array.isArray(v) ? v : [v]))
    .optional()
    .catch([]),
})

export function JobListingItems(props: Props) {
  return (
    <Suspense>
      <SuspendedComponent {...props} />
    </Suspense>
  )
}

async function SuspendedComponent({ searchParams, params }: Props) {
  const jobListingId = params ? (await params).jobListingId : undefined
  const { success, data } = searchParamsSchema.safeParse(await searchParams)
  const search = success ? data : {}

  const jobListings = await getJobListings(search, jobListingId)
  if (jobListings.length === 0) {
    return (
      <div className="text-muted-foreground p-4">No job listings found</div>
    )
  }

  return (
    <div className="space-y-4">
      {jobListings.map(jobListing => (
        <Link
          className="block"
          key={jobListing.id}
          href={`/job-listings/${jobListing.id}?${convertSearchParamsToString(
            search
          )}`}
        >
          <JobListingListItem
            jobListing={jobListing}
            user={jobListing.user}
          />
        </Link>
      ))}
    </div>
  )
}

function JobListingListItem({
  jobListing,
  user,
}: {
  jobListing: Pick<
    typeof JobListingTable.$inferSelect,
    | "title"
    | "state_abbreviation" // Use snake_case to match schema
    | "city"
    | "wage"
    | "wage_interval" // Use snake_case to match schema
    | "experience_level" // Use snake_case to match schema
    | "type"
    | "posted_at" // Use snake_case to match schema
    | "location_requirement" // Use snake_case to match schema
    | "is_featured" // Use snake_case to match schema
  >
  user: Pick<typeof UserTable.$inferSelect, "name" | "image_url"> // Use snake_case to match schema
}) {
  const nameInitials = user?.name
    ?.split(" ")
    .splice(0, 4)
    .map(word => word[0])
    .join("") || "U"

  return (
    <Card
      className={cn(
        "@container",
        jobListing.is_featured && "border-featured bg-featured/20" // Use snake_case
      )}
    >
      <CardHeader>
        <div className="flex gap-4">
          <Avatar className="size-14 @max-sm:hidden">
            <AvatarImage
              src={user.image_url ?? undefined} // Use snake_case
              alt={user.name || "User"}
            />
            <AvatarFallback className="uppercase bg-primary text-primary-foreground">
              {nameInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl">{jobListing.title}</CardTitle>
            <CardDescription className="text-base">
              Posted by {user.name || "Anonymous User"}
            </CardDescription>
            {jobListing.posted_at != null && ( // Use snake_case
              <div className="text-sm font-medium text-primary @min-md:hidden">
                <Suspense fallback={jobListing.posted_at.toLocaleDateString()}>
                  <DaysSincePosting postedAt={jobListing.posted_at} /> {/* Use snake_case */}
                </Suspense>
              </div>
            )}
          </div>
          {jobListing.posted_at != null && ( // Use snake_case
            <div className="text-sm font-medium text-primary ml-auto @max-md:hidden">
              <Suspense fallback={jobListing.posted_at.toLocaleDateString()}>
                <DaysSincePosting postedAt={jobListing.posted_at} /> {/* Use snake_case */}
              </Suspense>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <JobListingBadges
          jobListing={jobListing}
          className={jobListing.is_featured ? "border-primary/35" : undefined} // Use snake_case
        />
      </CardContent>
    </Card>
  )
}

async function DaysSincePosting({ postedAt }: { postedAt: Date }) {
  await connection()
  const daysSincePosted = differenceInDays(postedAt, Date.now())

  if (daysSincePosted === 0) {
    return <Badge>New</Badge>
  }

  return new Intl.RelativeTimeFormat(undefined, {
    style: "narrow",
    numeric: "always",
  }).format(daysSincePosted, "days")
}

async function getJobListings(
  searchParams: z.infer<typeof searchParamsSchema>,
  jobListingId: string | undefined
) {
  "use cache"
  cacheTag(getJobListingGlobalTag())

  const whereConditions: (SQL | undefined)[] = []
  if (searchParams.title) {
    whereConditions.push(
      ilike(JobListingTable.title, `%${searchParams.title}%`)
    )
  }

  if (searchParams.locationRequirement) {
    whereConditions.push(
      eq(JobListingTable.locationRequirement, searchParams.locationRequirement)
    )
  }

  if (searchParams.city) {
    whereConditions.push(ilike(JobListingTable.city, `%${searchParams.city}%`))
  }

  if (searchParams.state) {
    whereConditions.push(
      eq(JobListingTable.stateAbbreviation, searchParams.state)
    )
  }

  if (searchParams.experience) {
    whereConditions.push(
      eq(JobListingTable.experienceLevel, searchParams.experience)
    )
  }

  if (searchParams.type) {
    whereConditions.push(eq(JobListingTable.type, searchParams.type))
  }

  if (searchParams.jobIds) {
    whereConditions.push(
      or(...searchParams.jobIds.map(jobId => eq(JobListingTable.id, jobId)))
    )
  }

  let data
  try {
    // Try to query with user data first
    data = await db.query.JobListingTable.findMany({
      where: or(
        jobListingId
          ? and(
              eq(JobListingTable.status, "published"),
              eq(JobListingTable.id, jobListingId)
            )
          : undefined,
        and(eq(JobListingTable.status, "published"), ...whereConditions)
      ),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image_url: true, // Use snake_case to match schema
          },
        },
      },
      orderBy: [desc(JobListingTable.is_featured), desc(JobListingTable.posted_at)] // Use snake_case,
    })
  } catch (error) {
    console.log('RLS error accessing user data, falling back to job listings only:', error)
    // Fallback: Query without user data if RLS prevents access
    data = await db.query.JobListingTable.findMany({
      where: or(
        jobListingId
          ? and(
              eq(JobListingTable.status, "published"),
              eq(JobListingTable.id, jobListingId)
            )
          : undefined,
        and(eq(JobListingTable.status, "published"), ...whereConditions)
      ),
      orderBy: [desc(JobListingTable.is_featured), desc(JobListingTable.posted_at)] // Use snake_case,
    })
    
    // Add placeholder user data
    data = data.map(job => ({
      ...job,
      user: {
        id: job.user_id, // Use snake_case field name
        name: "Anonymous User",
        image_url: "" // Use snake_case to match schema
      }
    }))
  }

  // Cache tags for users instead of organizations
  // We can add user-specific cache tags here if needed in the future
  // data.forEach(listing => {
  //   cacheTag(getUserIdTag(listing.user.id))
  // })

  return data
}
