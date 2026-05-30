import { ActionButton } from "@/components/ActionButton"
import { MarkdownPartial } from "@/components/markdown/MarkdownPartial"
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { db } from "@/drizzle/db"
import {
  JobListingApplicationTable,
  JobListingStatus,
  JobListingTable,
} from "@/drizzle/schema"
import {
  ApplicationTable,
  SkeletonApplicationTable,
} from "@/features/jobListingApplications/components/ApplicationTable"
import { getJobListingApplicationJobListingTag } from "@/features/jobListingApplications/db/cache/jobListingApplications"
import {
  deleteJobListing,
  toggleJobListingFeatured,
  toggleJobListingStatus,
} from "@/features/jobListings/actions/actions"
import { JobListingBadges } from "@/features/jobListings/components/JobListingBadges"
import { getJobListingIdTag } from "@/features/jobListings/db/cache/jobListings"
import { formatJobListingStatus } from "@/features/jobListings/lib/formatters"
import { getNextJobListingStatus } from "@/features/jobListings/lib/utils"
import { getUserResumeIdTag } from "@/features/users/db/cache/userResumes"
import { getUserIdTag } from "@/features/users/db/cache/users"
import { requireOrganizationAuth } from "@/services/supabase/organization-auth"
import { and, eq } from "drizzle-orm"
import {
  EditIcon,
  EyeIcon,
  EyeOffIcon,
  StarIcon,
  StarOffIcon,
  Trash2Icon,
} from "lucide-react"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

type Props = {
  params: Promise<{ jobListingId: string }>
}

export default function JobListingPage(props: Props) {
  return (
    <Suspense>
      <SuspendedPage {...props} />
    </Suspense>
  )
}

async function SuspendedPage({ params }: Props) {
  const { organizationId } = await requireOrganizationAuth()

  const { jobListingId } = await params
  const jobListing = await getJobListing(jobListingId, organizationId)
  if (jobListing == null) return notFound()

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 @container">
      <div className="flex items-center justify-between gap-4 @max-4xl:flex-col @max-4xl:items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {jobListing.title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge>{formatJobListingStatus(jobListing.status)}</Badge>
            <JobListingBadges jobListing={jobListing} />
          </div>
        </div>
        <div className="flex items-center gap-2 empty:-mt-4">
          <Button asChild variant="outline">
            <Link href={`/employer/job-listings/${jobListing.id}/edit`}>
              <EditIcon className="size-4" />
              Edit
            </Link>
          </Button>
          <StatusUpdateButton status={jobListing.status} id={jobListing.id} />
          {jobListing.status === "published" && (
            <FeaturedToggleButton
              isFeatured={jobListing.is_featured} // Use snake_case
              id={jobListing.id}
            />
          )}
          <ActionButton
            variant="destructive"
            action={deleteJobListing.bind(null, jobListing.id)}
            requireAreYouSure
          >
            <Trash2Icon className="size-4" />
            Delete
          </ActionButton>
        </div>
      </div>

      <MarkdownPartial
        dialogMarkdown={<MarkdownRenderer source={jobListing.description} />}
        mainMarkdown={
          <MarkdownRenderer
            className="prose-sm"
            source={jobListing.description}
          />
        }
        dialogTitle="Description"
      />

      <Separator />

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Applications</h2>
        <Suspense fallback={<SkeletonApplicationTable />}>
          <Applications jobListingId={jobListingId} />
        </Suspense>
      </div>
    </div>
  )
}

function StatusUpdateButton({
  status,
  id,
}: {
  status: JobListingStatus
  id: string
}) {
  const button = (
    <ActionButton
      action={toggleJobListingStatus.bind(null, id)}
      variant="outline"
      requireAreYouSure={getNextJobListingStatus(status) === "published"}
      areYouSureDescription="This will immediately show this job listing to all users."
    >
      {statusToggleButtonText(status)}
    </ActionButton>
  )

  return button
}

function FeaturedToggleButton({
  isFeatured,
  id,
}: {
  isFeatured: boolean
  id: string
}) {
  const button = (
    <ActionButton
      action={toggleJobListingFeatured.bind(null, id)}
      variant="outline"
    >
      {featuredToggleButtonText(isFeatured)}
    </ActionButton>
  )

  return button
}


function statusToggleButtonText(status: JobListingStatus) {
  switch (status) {
    case "delisted":
    case "draft":
      return (
        <>
          <EyeIcon className="size-4" />
          Publish
        </>
      )
    case "published":
      return (
        <>
          <EyeOffIcon className="size-4" />
          Delist
        </>
      )
    default:
      throw new Error(`Unknown status: ${status satisfies never}`)
  }
}

function featuredToggleButtonText(isFeatured: boolean) {
  if (isFeatured) {
    return (
      <>
        <StarOffIcon className="size-4" />
        UnFeature
      </>
    )
  }

  return (
    <>
      <StarIcon className="size-4" />
      Feature
    </>
  )
}

async function Applications({ jobListingId }: { jobListingId: string }) {
  const applications = await getJobListingApplications(jobListingId)

  return (
    <ApplicationTable
      applications={applications.map(a => ({
        ...a,
        createdAt: a.created_at,
        jobListingId: a.job_listing_id,
        user: {
          ...a.applicant,
          imageUrl: a.applicant.image_url,
          resume: a.applicant.resumes && a.applicant.resumes[0]
            ? {
                ...a.applicant.resumes[0],
                resumeFileUrl: a.applicant.resumes[0].url,
                markdownSummary: a.applicant.resumes[0].ai_summary ? (
                  <MarkdownRenderer source={a.applicant.resumes[0].ai_summary} />
                ) : null,
              }
            : null,
        },
        coverLetterMarkdown: null, // Cover letter not available in current schema
      }))}
      canUpdateRating={true}
      canUpdateStage={true}
    />
  )
}

async function getJobListingApplications(jobListingId: string) {
  "use cache"
  cacheTag(getJobListingApplicationJobListingTag(jobListingId))

  const data = await db.query.JobListingApplicationTable.findMany({
    where: eq(JobListingApplicationTable.job_listing_id, jobListingId),
    with: {
      applicant: {
        columns: {
          id: true,
          name: true,
          image_url: true,
        },
        with: {
          resumes: {
            columns: {
              url: true,
              ai_summary: true,
            },
          },
        },
      },
    },
  })

  data.forEach(({ applicant }) => {
    cacheTag(getUserIdTag(applicant.id))
    cacheTag(getUserResumeIdTag(applicant.id))
  })

  return data
}

async function getJobListing(id: string, organizationId: string) {
  "use cache"
  cacheTag(getJobListingIdTag(id))

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.organization_id, organizationId)
    ),
  })
}
