import { redirect } from "next/navigation"

export default function Page() {
  // Redirect to our new Supabase sign-up page
  redirect('/auth/sign-up')
}