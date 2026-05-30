import { getCurrentUser } from "@/services/supabase/auth"
import { db } from "@/drizzle/db"
import { JobListingTable } from "@/drizzle/schema"
import { eq, desc } from "drizzle-orm"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function JobListingsPage() {
  const { user } = await getCurrentUser()
  
  // Simple query without organization relation to avoid schema issues
  let jobListings: (typeof JobListingTable.$inferSelect)[] = []
  let debugInfo = ""
  try {
    // First, let's get ALL job listings to see what we have
    const allJobListings = await db.query.JobListingTable.findMany({
      limit: 50
    })
    
    debugInfo = `Total jobs in DB: ${allJobListings.length}`
    
    // Then get only published ones
    jobListings = await db.query.JobListingTable.findMany({
      where: eq(JobListingTable.status, "published"),
      orderBy: [desc(JobListingTable.posted_at)],
      limit: 20
    })
    
    debugInfo += ` | Published jobs: ${jobListings.length}`
    
    if (allJobListings.length > 0 && jobListings.length === 0) {
      // Show first job to debug status
      debugInfo += ` | First job status: ${allJobListings[0].status}`
    }
    
  } catch (error) {
    console.error("Error fetching job listings:", error)
    debugInfo = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
  }
  
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold text-foreground">Job Listings</h1>
        <p className="text-muted-foreground mt-2">
          Discover opportunities that match your skills and interests
        </p>
        {user && (
          <p className="text-sm text-blue-600 mt-1">
            Logged in as: {user.email}
          </p>
        )}
        <div className="text-xs bg-gray-100 p-2 rounded mt-2">
          <strong>Debug:</strong> {debugInfo}
        </div>
      </div>
      
      <div className="space-y-4">
        {jobListings.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Job Listings Found</h3>
            <p className="text-gray-500">
              There are currently no published job listings available.
            </p>
            <div className="mt-4 text-sm bg-yellow-50 p-4 rounded">
              <strong>For Demo:</strong> Make sure the demo data has been created with published job listings.
            </div>
          </div>
        ) : (
          jobListings.map(job => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      Company ID: {job.organization_id || 'Unknown'}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{job.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">{job.location_requirement}</Badge>
                  <Badge variant="outline">{job.experience_level}</Badge>
                  {job.city && job.state_abbreviation && (
                    <Badge variant="outline">{job.city}, {job.state_abbreviation}</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {job.description?.substring(0, 200)}...
                </p>
                <div className="mt-4">
                  <Link 
                    href={`/job-listings/${job.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
