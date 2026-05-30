import { NextRequest, NextResponse } from "next/server"
import { createOrganizationUser } from "@/services/supabase/organization-auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, company_name, website_url } = body

    if (!email || !password || !company_name) {
      return NextResponse.json(
        { error: "Email, password, and company name are required" },
        { status: 400 }
      )
    }

    const result = await createOrganizationUser({
      email,
      password,
      company_name,
      website_url,
    })

    return NextResponse.json({
      success: true,
      organization: {
        id: result.organization.id,
        company_name: result.organization.company_name,
      }
    })

  } catch (error) {
    console.error("Organization sign-up error:", error)
    
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}