import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          req.cookies.set({ name, value, ...options })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: Record<string, unknown>) {
          req.cookies.set({ name, value: '', ...options })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Get user session
  const { data: { user } } = await supabase.auth.getUser()

  // Debug: Log user session status
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 Middleware - Path: ${req.nextUrl.pathname}, User: ${user ? user.email : 'none'}`)
  }

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/sign-in',
    '/auth/sign-up',
    '/debug-auth',
    '/job-listings',
    '/ai-search',
    '/ai-agent-demo',
    '/api/uploadthing',
    '/api/auth/sync-user',
    '/api/auth/sync-users',
    '/api/auth/cleanup-users',
    '/api/auth/debug-users',
  ]

  const isPublicRoute = publicRoutes.some(route => 
    req.nextUrl.pathname === route || 
    req.nextUrl.pathname.startsWith(route + '/')
  )

  // Check for client-side auth indicators in cookies
  const hasAuthCookies = req.cookies.getAll().some(cookie => 
    cookie.name.includes('supabase') || 
    cookie.name.includes('auth-token') ||
    cookie.name.includes('refresh')
  )
  
  // Also check for our custom auth cookie
  const hasCustomAuthCookie = !!req.cookies.get('supabase-auth-token')?.value


  // If route requires auth and user is not authenticated, check for auth cookies
  if (!isPublicRoute && !user) {
    // If we have auth-related cookies, allow the request to proceed
    // The client-side will handle the authentication state
    if (hasAuthCookies || hasCustomAuthCookie) {
      return res
    }
    
    return NextResponse.redirect(new URL('/auth/sign-in', req.url))
  }

  // If user is authenticated and trying to access auth pages, redirect to home
  if (user && (req.nextUrl.pathname.startsWith('/auth/') || req.nextUrl.pathname.startsWith('/sign-in') || req.nextUrl.pathname.startsWith('/sign-up'))) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
