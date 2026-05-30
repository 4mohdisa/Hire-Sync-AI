import { NextRequest, NextResponse } from "next/server"
import { getOrganizationByEmail } from "@/features/organizations/db/organizations"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const organization = await getOrganizationByEmail(email)

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      organization: {
        id: organization.id,
        company_name: organization.company_name,
        is_verified: organization.is_verified
      }
    })

  } catch (error) {
    console.error("Organization verification error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}