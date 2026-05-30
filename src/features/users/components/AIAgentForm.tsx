"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useState } from 'react'
import { PlayIcon, PauseIcon, SettingsIcon, BrainIcon, TargetIcon, ClockIcon, ZapIcon, CheckCircleIcon } from 'lucide-react'

export function AIAgentForm() {
  const [isAgentActive, setIsAgentActive] = useState(false)
  const [isDemoRunning, setIsDemoRunning] = useState(false)
  const [appliedJobs, setAppliedJobs] = useState<string[]>([])
  const [preferences, setPreferences] = useState({
    jobTitles: "Software Engineer, Full Stack Developer, Frontend Developer",
    locations: "Remote, San Francisco, New York",
    salaryMin: "80000",
    salaryMax: "150000",
    experienceLevel: "mid-level",
    companySize: "any",
    workType: "remote"
  })
  
  const [agentSettings, setAgentSettings] = useState({
    maxApplicationsPerDay: "5",
    applicationDelay: "2",
    coverLetterPersonalization: true,
    followUpEmails: false,
    onlyApplyToVerified: true,
    skipManualReview: false
  })

  const [questions, setQuestions] = useState({
    whyInterested: "I&apos;m passionate about building innovative software solutions that make a positive impact. I&apos;m particularly drawn to companies that value creativity, collaboration, and continuous learning.",
    greatestStrength: "My ability to quickly learn new technologies and adapt to different tech stacks while maintaining high code quality and attention to detail.",
    careerGoals: "To grow as a full-stack developer while contributing to meaningful projects that solve real-world problems. I&apos;m interested in both technical leadership and mentoring opportunities.",
    workStyle: "I thrive in collaborative environments where I can both contribute ideas and learn from experienced team members. I prefer clear communication and regular feedback.",
    availability: "I&apos;m available to start immediately and can commit to full-time employment.",
    relocate: "I&apos;m open to relocation for the right opportunity, especially to tech hubs like San Francisco, Seattle, or Austin."
  })

  const demoJobs = [
    "Software Engineer Internship Opportunities at Microsoft",
    "Frontend Developer - React at Microsoft", 
    "Data Scientist - AI/ML at Microsoft",
    "Cloud Solutions Architect at Microsoft",
    "Product Manager - Office 365 at Microsoft",
    "DevOps Engineer - Azure at Microsoft"
  ]

  const runBulkApplicationDemo = async () => {
    setIsDemoRunning(true)
    setAppliedJobs([])
    
    // Simulate applying to each job with delays
    for (let i = 0; i < demoJobs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800)) // 800ms delay between applications
      setAppliedJobs(prev => [...prev, demoJobs[i]])
    }
    
    // Stop demo after 2 seconds
    setTimeout(() => {
      setIsDemoRunning(false)
    }, 2000)
  }

  const handleSave = () => {
    // Since we don't have auth requirements, just show success message
    alert("AI Agent settings saved successfully! Note: This is a demo - actual functionality requires user authentication.")
  }

  return (
    <div className="space-y-6">
      {/* Agent Status */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isAgentActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          <div>
            <h3 className="font-semibold">AI Agent Status</h3>
            <p className="text-sm text-muted-foreground">
              {isAgentActive ? 'Active - Scanning for jobs' : 'Inactive - Paused'}
            </p>
          </div>
        </div>
        <Button 
          variant={isAgentActive ? "destructive" : "default"}
          onClick={() => setIsAgentActive(!isAgentActive)}
          className="min-w-[100px]"
        >
          {isAgentActive ? (
            <>
              <PauseIcon className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <PlayIcon className="w-4 h-4 mr-2" />
              Start
            </>
          )}
        </Button>
      </div>

      {/* Demo Section */}
      <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">🚀 Bulk Application Demo</h3>
            <p className="text-sm text-muted-foreground">
              Watch the AI agent apply to multiple jobs automatically
            </p>
          </div>
          <Button 
            onClick={runBulkApplicationDemo}
            disabled={isDemoRunning}
            variant="default"
            size="lg"
            className="min-w-[140px]"
          >
            {isDemoRunning ? (
              <>
                <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                Applying...
              </>
            ) : (
              <>
                <ZapIcon className="w-4 h-4 mr-2" />
                Apply to All Jobs
              </>
            )}
          </Button>
        </div>
        
        {(isDemoRunning || appliedJobs.length > 0) && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">
              Applications Progress: {appliedJobs.length}/{demoJobs.length}
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {appliedJobs.map((job, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 p-2 bg-white rounded border animate-in fade-in slide-in-from-left duration-500"
                >
                  <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Applied to: {job}</span>
                  <Badge variant="secondary" className="ml-auto">
                    Applied
                  </Badge>
                </div>
              ))}
            </div>
            {!isDemoRunning && appliedJobs.length === demoJobs.length && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    Successfully applied to {appliedJobs.length} jobs! 🎉
                  </span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Your applications have been submitted and you&apos;ll receive notifications for any responses.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TargetIcon className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Applications Today</span>
            </div>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">of 5 max</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BrainIcon className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Match Score</span>
            </div>
            <p className="text-2xl font-bold">87%</p>
            <p className="text-xs text-muted-foreground">avg match rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Next Check</span>
            </div>
            <p className="text-2xl font-bold">2h</p>
            <p className="text-xs text-muted-foreground">15m remaining</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Job Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TargetIcon className="w-5 h-5" />
            Job Preferences
          </CardTitle>
          <CardDescription>
            Define what types of jobs you&apos;re looking for
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitles">Job Titles (comma separated)</Label>
              <Textarea
                id="jobTitles"
                placeholder="e.g. Software Engineer, Frontend Developer"
                value={preferences.jobTitles}
                onChange={(e) => setPreferences({...preferences, jobTitles: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locations">Preferred Locations</Label>
              <Textarea
                id="locations"
                placeholder="e.g. Remote, San Francisco, New York"
                value={preferences.locations}
                onChange={(e) => setPreferences({...preferences, locations: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salaryMin">Minimum Salary ($)</Label>
              <Input
                id="salaryMin"
                type="number"
                placeholder="80000"
                value={preferences.salaryMin}
                onChange={(e) => setPreferences({...preferences, salaryMin: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryMax">Maximum Salary ($)</Label>
              <Input
                id="salaryMax"
                type="number"
                placeholder="150000"
                value={preferences.salaryMax}
                onChange={(e) => setPreferences({...preferences, salaryMax: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Experience Level</Label>
              <Select value={preferences.experienceLevel} onValueChange={(value) => setPreferences({...preferences, experienceLevel: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid-level">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                  <SelectItem value="lead">Lead/Principal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Company Size</Label>
              <Select value={preferences.companySize} onValueChange={(value) => setPreferences({...preferences, companySize: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Size</SelectItem>
                  <SelectItem value="startup">Startup (1-50)</SelectItem>
                  <SelectItem value="small">Small (51-200)</SelectItem>
                  <SelectItem value="medium">Medium (201-1000)</SelectItem>
                  <SelectItem value="large">Large (1000+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Work Type</Label>
              <Select value={preferences.workType} onValueChange={(value) => setPreferences({...preferences, workType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                  <SelectItem value="any">Any</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Agent Settings
          </CardTitle>
          <CardDescription>
            Configure how the AI agent behaves
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxApplications">Max Applications Per Day</Label>
              <Select value={agentSettings.maxApplicationsPerDay} onValueChange={(value) => setAgentSettings({...agentSettings, maxApplicationsPerDay: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 application</SelectItem>
                  <SelectItem value="3">3 applications</SelectItem>
                  <SelectItem value="5">5 applications</SelectItem>
                  <SelectItem value="10">10 applications</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="delay">Delay Between Applications (hours)</Label>
              <Select value={agentSettings.applicationDelay} onValueChange={(value) => setAgentSettings({...agentSettings, applicationDelay: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">30 minutes</SelectItem>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Personalize Cover Letters</Label>
                <p className="text-sm text-muted-foreground">
                  AI will customize cover letters for each job
                </p>
              </div>
              <Switch
                checked={agentSettings.coverLetterPersonalization}
                onCheckedChange={(checked) => setAgentSettings({...agentSettings, coverLetterPersonalization: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Send Follow-up Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically send follow-up emails after 1 week
                </p>
              </div>
              <Switch
                checked={agentSettings.followUpEmails}
                onCheckedChange={(checked) => setAgentSettings({...agentSettings, followUpEmails: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Only Apply to Verified Companies</Label>
                <p className="text-sm text-muted-foreground">
                  Skip applications to unverified or suspicious listings
                </p>
              </div>
              <Switch
                checked={agentSettings.onlyApplyToVerified}
                onCheckedChange={(checked) => setAgentSettings({...agentSettings, onlyApplyToVerified: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Skip Manual Review</Label>
                <p className="text-sm text-muted-foreground">
                  Apply immediately without showing you the job first
                </p>
              </div>
              <Switch
                checked={agentSettings.skipManualReview}
                onCheckedChange={(checked) => setAgentSettings({...agentSettings, skipManualReview: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pre-filled Answers */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-filled Application Answers</CardTitle>
          <CardDescription>
            These answers will be used to automatically fill common application questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whyInterested">Why are you interested in this position?</Label>
            <Textarea
              id="whyInterested"
              value={questions.whyInterested}
              onChange={(e) => setQuestions({...questions, whyInterested: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="greatestStrength">What is your greatest strength?</Label>
            <Textarea
              id="greatestStrength"
              value={questions.greatestStrength}
              onChange={(e) => setQuestions({...questions, greatestStrength: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="careerGoals">What are your career goals?</Label>
            <Textarea
              id="careerGoals"
              value={questions.careerGoals}
              onChange={(e) => setQuestions({...questions, careerGoals: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workStyle">Describe your work style</Label>
              <Textarea
                id="workStyle"
                value={questions.workStyle}
                onChange={(e) => setQuestions({...questions, workStyle: e.target.value})}
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="availability">When can you start?</Label>
              <Textarea
                id="availability"
                value={questions.availability}
                onChange={(e) => setQuestions({...questions, availability: e.target.value})}
                rows={2}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="relocate">Are you willing to relocate?</Label>
            <Textarea
              id="relocate"
              value={questions.relocate}
              onChange={(e) => setQuestions({...questions, relocate: e.target.value})}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">🤖 AI Agent Ready</Badge>
        <Badge variant="outline">📝 Resume Required</Badge>
        <Badge variant="outline">✅ Settings Configured</Badge>
        {isAgentActive && <Badge variant="default">🔍 Active Scanning</Badge>}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} size="lg">
          Save AI Agent Settings
        </Button>
      </div>
    </div>
  )
}