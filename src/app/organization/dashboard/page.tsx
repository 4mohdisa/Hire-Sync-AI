import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentOrganization } from "@/services/supabase/organization-auth"
import { getOrganizationWithJobListings } from "@/features/organizations/db/organizations"
import Link from "next/link"
import { Plus, Building2, Users, ClipboardList, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"

export default async function OrganizationDashboard() {
  const { organizationId, organization } = await getCurrentOrganization()

  if (!organizationId || !organization) {
    notFound()
  }

  const organizationWithJobs = await getOrganizationWithJobListings(organizationId)

  if (!organizationWithJobs) {
    notFound()
  }

  const jobStats = {
    total: organizationWithJobs.jobListings?.length || 0,
    published: organizationWithJobs.jobListings?.filter(job => job.status === 'published').length || 0,
    draft: organizationWithJobs.jobListings?.filter(job => job.status === 'draft').length || 0,
    featured: organizationWithJobs.jobListings?.filter(job => job.is_featured).length || 0,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  {organizationWithJobs.logo_url ? (
                    <img 
                      src={organizationWithJobs.logo_url} 
                      alt={organizationWithJobs.company_name}
                      className="w-8 h-8 rounded"
                    />
                  ) : (
                    <Building2 className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {organizationWithJobs.company_name}
                  </h1>
                  <p className="text-gray-600">Organization Dashboard</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button asChild>
                  <Link href="/organization/job-listings/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Job
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobStats.total}</div>
              <p className="text-xs text-muted-foreground">
                All job listings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{jobStats.published}</div>
              <p className="text-xs text-muted-foreground">
                Live job postings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{jobStats.draft}</div>
              <p className="text-xs text-muted-foreground">
                Draft job listings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{jobStats.featured}</div>
              <p className="text-xs text-muted-foreground">
                Featured listings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Job Listings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Job Listings</CardTitle>
                <CardDescription>
                  Manage your job postings and track applications
                </CardDescription>
              </div>
              <Button asChild variant="outline">
                <Link href="/organization/job-listings">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {jobStats.total === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No job listings yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first job listing to start attracting top talent.
                </p>
                <Button asChild>
                  <Link href="/organization/job-listings/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Job Listing
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {organizationWithJobs.jobListings?.slice(0, 5).map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{job.title}</h4>
                        <Badge variant={
                          job.status === 'published' ? 'default' : 
                          job.status === 'draft' ? 'secondary' : 'outline'
                        }>
                          {job.status}
                        </Badge>
                        {job.is_featured && (
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>{job.location_requirement}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                        <span>•</span>
                        <span>{job.experience_level}</span>
                        {job.wage && (
                          <>
                            <span>•</span>
                            <span>${job.wage.toLocaleString()} {job.wage_interval}</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Created {new Date(job.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/organization/job-listings/${job.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}