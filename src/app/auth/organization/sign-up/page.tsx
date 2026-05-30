import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OrganizationSignUpForm } from "@/features/organizations/components/OrganizationSignUpForm"
import Link from "next/link"

export default function OrganizationSignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create Organization Account
          </CardTitle>
          <CardDescription className="text-center">
            Sign up your company to start posting job listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrganizationSignUpForm />
          
          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Looking for a job?{" "}
                <Link 
                  href="/auth/sign-up" 
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Create job seeker account
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Already have an organization account?{" "}
                <Link 
                  href="/auth/organization/sign-in" 
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}