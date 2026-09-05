import { Metadata } from "next"

import SignUpForm from "@/app/components/auth/SignUpForm"

export const metadata: Metadata = {
  title: `Sign Up | Kasbon`
}

export default function SignUpLayout() {
  return (
    <SignUpForm />
  )
}
