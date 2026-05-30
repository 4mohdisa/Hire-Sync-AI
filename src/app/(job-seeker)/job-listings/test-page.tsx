import { getCurrentUser } from "@/services/supabase/auth"

export default async function TestJobListingsPage() {
  const { user } = await getCurrentUser()
  
  return (
    <div className="space-y-6 p-8">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold text-foreground">Job Listings (Test)</h1>
        <p className="text-muted-foreground mt-2">
          Test page - User: {user?.email || 'Not logged in'}
        </p>
      </div>
      
      <div className="bg-green-50 p-4 rounded">
        <h2 className="font-semibold text-green-800">✅ Route Working!</h2>
        <p className="text-green-700">The job listings route is accessible and authentication is working.</p>
        
        {user && (
          <div className="mt-4 text-sm">
            <strong>User Details:</strong>
            <pre className="bg-white p-2 rounded mt-2 text-xs">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 p-4 rounded">
        <h3 className="font-semibold text-blue-800">🔗 Next Steps:</h3>
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          <li>Test the actual job listings component</li>
          <li>Check database connections</li>
          <li>Verify demo job data exists</li>
        </ul>
      </div>
    </div>
  )
}