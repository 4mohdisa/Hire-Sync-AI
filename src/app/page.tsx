import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { getCurrentUser } from "@/services/supabase/auth"
import { 
  BrainCircuit, 
  CheckCircle, 
  Star, 
  Menu,
  Globe,
  Settings,
  LogOut
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Suspense } from "react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BrainCircuit className="w-8 h-8 text-primary mr-2" />
              <span className="text-xl font-bold text-foreground">HireSync AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground text-sm font-medium">Find Talent</a>
              <Link href="/job-listings" className="text-muted-foreground hover:text-foreground text-sm font-medium">Find Work</Link>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground text-sm font-medium">Why HireSync AI</a>
              <a href="#enterprise" className="text-muted-foreground hover:text-foreground text-sm font-medium">Enterprise</a>
              <Suspense fallback={
                <>
                  <Link href="/auth/sign-in" className="text-muted-foreground hover:text-foreground text-sm font-medium">Log In</Link>
                  <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
                    <Link href="/auth/sign-up">Sign Up</Link>
                  </Button>
                </>
              }>
                <AuthAwareNavigation />
              </Suspense>
            </div>
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-muted">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Connecting clients in need to{" "}
                  <span className="text-primary">freelancers</span> who deliver
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Get matched with the perfect talent for your project, or find your next great opportunity.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-4 text-lg font-medium">
                  <Link href="/auth/organization/sign-up">Find Talent</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary/5 rounded-full px-8 py-4 text-lg font-medium">
                  <Link href="/job-listings">Find Work</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              {/* Hero Image Placeholder */}
              <div className="bg-black rounded-2xl aspect-[4/3] flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="text-lg font-medium">Hero Dashboard Screenshot</p>
                  <p className="text-sm opacity-75 mt-2">
                    Professional working at laptop with project interface
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-8">
            <p className="text-muted-foreground text-lg">Explore millions of pros</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm font-medium text-foreground">Top rated</span>
              </div>
              <p className="text-xs text-muted-foreground">Quality work done quickly</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm font-medium text-foreground">Vetted</span>
              </div>
              <p className="text-xs text-muted-foreground">Proven track record</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm font-medium text-foreground">Available</span>
              </div>
              <p className="text-xs text-muted-foreground">Ready to work now</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm font-medium text-foreground">Affordable</span>
              </div>
              <p className="text-xs text-muted-foreground">Great value for money</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm font-medium text-foreground">Fast</span>
              </div>
              <p className="text-xs text-muted-foreground">Quick turnaround</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How it works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-black rounded-xl aspect-[4/3] mb-6 flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="text-sm font-medium">Post a job</p>
                  <p className="text-xs opacity-75 mt-1">Job posting interface</p>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Post a job</h3>
              <p className="text-muted-foreground">Tell us what you need done and receive competitive bids from freelancers.</p>
            </div>
            <div className="text-center">
              <div className="bg-black rounded-xl aspect-[4/3] mb-6 flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="text-sm font-medium">Choose freelancers</p>
                  <p className="text-xs opacity-75 mt-1">Freelancer selection UI</p>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Choose freelancers</h3>
              <p className="text-muted-foreground">Compare profiles, reviews, and proposals then interview your favorites.</p>
            </div>
            <div className="text-center">
              <div className="bg-black rounded-xl aspect-[4/3] mb-6 flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="text-sm font-medium">Get work done</p>
                  <p className="text-xs opacity-75 mt-1">Project collaboration tools</p>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Get work done</h3>
              <p className="text-muted-foreground">Use our platform to chat, share files and collaborate until the job is done.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground leading-tight">
                Get insights into freelancer pricing
              </h2>
              <p className="text-lg text-muted-foreground">
                Receive quotes from multiple freelancers and choose the best fit for your project and budget.
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-3">
                Find Talent
              </Button>
            </div>
            <div className="relative">
              <div className="bg-black rounded-2xl aspect-[4/3] flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="text-lg font-medium">Pricing Insights Dashboard</p>
                  <p className="text-sm opacity-75 mt-2">
                    Charts and analytics for project pricing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-muted">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Clients rate professionals on HireSync AI
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border border-border bg-card p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">4.9/5</span>
                </div>
                <p className="text-card-foreground">&ldquo;This freelancer delivered exactly what I needed. Great communication and fast turnaround.&rdquo;</p>
                <div className="text-sm text-muted-foreground">- Marketing Manager</div>
              </div>
            </Card>
            <Card className="border border-border bg-card p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">5.0/5</span>
                </div>
                <p className="text-card-foreground">&ldquo;Exceptional work quality and attention to detail. Will definitely hire again.&rdquo;</p>
                <div className="text-sm text-muted-foreground">- Startup Founder</div>
              </div>
            </Card>
            <Card className="border border-border bg-card p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">4.8/5</span>
                </div>
                <p className="text-card-foreground">&ldquo;Professional, reliable, and delivered on time. Highly recommended!&rdquo;</p>
                <div className="text-sm text-muted-foreground">- Product Manager</div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Growth Section */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Find your next hire in a short time of long-term growth
            </h2>
          </div>
          <div className="bg-black rounded-2xl aspect-[16/6] flex items-center justify-center">
            <div className="text-white text-center">
              <p className="text-lg font-medium">Growth Statistics Visualization</p>
              <p className="text-sm opacity-75 mt-2">
                Charts showing hiring success rates and growth metrics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Find your next hire in a short time of long-term growth
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" variant="secondary" asChild className="bg-background text-primary hover:bg-muted rounded-full px-8 py-4 text-lg font-medium">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <BrainCircuit className="w-8 h-8 text-primary mr-2" />
                <span className="text-xl font-bold">HireSync AI</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Connecting talent with opportunity through AI-powered matching.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm text-background">For Clients</h3>
              <div className="space-y-2 text-muted-foreground text-sm">
                <Link href="/how-to-hire" className="block hover:text-background transition-colors">How to Hire</Link>
                <Link href="/talent-marketplace" className="block hover:text-background transition-colors">Talent Marketplace</Link>
                <Link href="/project-catalog" className="block hover:text-background transition-colors">Project Catalog</Link>
                <Link href="/enterprise" className="block hover:text-background transition-colors">Enterprise</Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm text-background">For Talent</h3>
              <div className="space-y-2 text-muted-foreground text-sm">
                <Link href="/how-to-find-work" className="block hover:text-background transition-colors">How to Find Work</Link>
                <Link href="/direct-contracts" className="block hover:text-background transition-colors">Direct Contracts</Link>
                <Link href="/find-freelance-jobs" className="block hover:text-background transition-colors">Find Freelance Jobs</Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm text-background">Resources</h3>
              <div className="space-y-2 text-muted-foreground text-sm">
                <Link href="/help" className="block hover:text-background transition-colors">Help & Support</Link>
                <Link href="/success-stories" className="block hover:text-background transition-colors">Success Stories</Link>
                <Link href="/reviews" className="block hover:text-background transition-colors">Reviews</Link>
                <Link href="/resources" className="block hover:text-background transition-colors">Resources</Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm text-background">Company</h3>
              <div className="space-y-2 text-muted-foreground text-sm">
                <Link href="/about" className="block hover:text-background transition-colors">About Us</Link>
                <Link href="/leadership" className="block hover:text-background transition-colors">Leadership</Link>
                <Link href="/investor-relations" className="block hover:text-background transition-colors">Investor Relations</Link>
                <Link href="/careers" className="block hover:text-background transition-colors">Careers</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-muted mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <Link href="/terms" className="hover:text-background transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="hover:text-background transition-colors">Privacy Policy</Link>
                <Link href="/ca-privacy" className="hover:text-background transition-colors">CA Privacy Notice</Link>
                <Link href="/cookie-policy" className="hover:text-background transition-colors">Cookie Policy</Link>
                <Link href="/accessibility" className="hover:text-background transition-colors">Accessibility</Link>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-4">
                  <a href="#" className="text-muted-foreground hover:text-background transition-colors">
                    <span className="sr-only">Facebook</span>
                    <Globe className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-background transition-colors">
                    <span className="sr-only">LinkedIn</span>
                    <Globe className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-background transition-colors">
                    <span className="sr-only">Twitter</span>
                    <Globe className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
              © 2015-2024 HireSync AI® Global Inc.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

async function AuthAwareNavigation() {
  const { user, userId } = await getCurrentUser()
  
  if (!user || !userId) {
    // Show login/signup buttons for anonymous users
    return (
      <>
        <Link href="/auth/sign-in" className="text-muted-foreground hover:text-foreground text-sm font-medium">Log In</Link>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
          <Link href="/auth/sign-up">Sign Up</Link>
        </Button>
      </>
    )
  }

  // Show user profile dropdown for authenticated users
  const userInitials = user.user_metadata?.full_name
    ?.split(' ')
    .map((name: string) => name[0])
    .join('')
    .toUpperCase() || user.email?.substring(0, 2).toUpperCase() || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email || 'User'} />
            <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.user_metadata?.full_name && (
              <p className="font-medium text-sm">{user.user_metadata.full_name}</p>
            )}
            <p className="w-[200px] truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuItem asChild>
          <Link href="/user-settings/profile" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <form action="/auth/sign-out" method="post">
            <button type="submit" className="flex w-full items-center cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}