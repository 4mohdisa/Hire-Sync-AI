import { JobListingItems } from "./_shared/JobListingItems"
import { SignOutButton } from "@/services/supabase/components/AuthButtons"
import { getCurrentUser } from "@/services/supabase/auth"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>
}) {
  const { user } = await getCurrentUser()
  
  return (
    <div className="m-4">
      {/* Temporary debug section */}
      {user && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
          <p className="text-sm text-yellow-800 mb-2">
            <strong>Debug:</strong> You are signed in as {user.email}
          </p>
          <SignOutButton>
            <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
              Sign Out (Clear Session)
            </button>
          </SignOutButton>
        </div>
      )}
      
      <JobListingItems searchParams={searchParams} />
    </div>
  )
}
