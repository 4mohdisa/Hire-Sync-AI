import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AIAgentForm } from "@/features/users/components/AIAgentForm"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"

export default function AIAgentDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold">AI Agent Demo</h1>
          <p className="text-muted-foreground mt-2">
            Explore our AI-powered job application automation features (Demo Mode - No Authentication Required)
          </p>
        </div>

        {/* Demo Notice */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
              i
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Demo Mode</h3>
              <p className="text-blue-800 text-sm">
                This is a demonstration of our AI Agent features. To use the actual functionality, 
                you&apos;ll need to <Link href="/auth/sign-up" className="underline font-semibold">create an account</Link> and 
                upload your resume.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Job Application Automation</CardTitle>
            <CardDescription>
              Configure your AI agent to automatically apply for jobs that match your preferences.
              The agent will use your resume and cover letter template to submit applications on your behalf.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AIAgentForm />
          </CardContent>
        </Card>
        
        {/* How It Works Section */}
        <Card className="mt-6">
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

        {/* CTA Section */}
        <div className="mt-8 text-center p-6 bg-white rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold mb-2">Ready to Start?</h2>
          <p className="text-muted-foreground mb-4">
            Create your account and upload your resume to activate the AI agent
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/sign-up">
                Get Started
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/sign-in">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}