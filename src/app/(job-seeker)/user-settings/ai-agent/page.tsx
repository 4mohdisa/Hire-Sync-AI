import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { AIAgentForm } from "@/features/users/components/AIAgentForm"

export default function AIAgentPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 px-4">
      <h1 className="text-2xl font-bold">AI Agent Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Job Application Automation</CardTitle>
          <CardDescription>
            Configure your AI agent to automatically apply for jobs that match your preferences.
            The agent will use your resume and cover letter template to submit applications on your behalf.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingSpinner />}>
            <AIAgentForm />
          </Suspense>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold">Job Scanning</h3>
                <p className="text-sm text-muted-foreground">
                  AI continuously scans job listings based on your criteria and preferences.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold">Smart Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Uses AI to analyze job requirements against your skills and experience.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold">Automated Application</h3>
                <p className="text-sm text-muted-foreground">
                  Submits applications with personalized cover letters and your resume.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                4
              </div>
              <div>
                <h3 className="font-semibold">Progress Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Keeps track of all applications and provides detailed reports.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}