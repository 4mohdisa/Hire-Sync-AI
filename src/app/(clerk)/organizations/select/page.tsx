import { redirect } from "next/navigation"

type Props = {
  searchParams: Promise<{ redirect?: string }>
}

export default async function OrganizationSelectPage(props: Props) {
  // Organizations no longer exist - redirect to home page
  const { redirect: redirectParam } = await props.searchParams
  const redirectUrl = redirectParam ?? "/"
  
  redirect(redirectUrl)
}
