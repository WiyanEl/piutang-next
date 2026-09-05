import { Metadata } from "next"

import SignInForm from "@/app/components/auth/SignInForm"

export const metadata: Metadata = {
  title: `Sign In | Kasbon`
}

export default function SignInLayout() {
  return (
    <SignInForm />
  )
}
