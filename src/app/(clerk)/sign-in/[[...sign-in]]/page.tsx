import { redirect } from "next/navigation"

export default function SignInPage() {
  // Redirect to our new Supabase sign-in page
  redirect('/auth/sign-in')
}
