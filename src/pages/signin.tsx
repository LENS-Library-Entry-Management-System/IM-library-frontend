import React from "react"
import SignInForm from "@/features/signIn/signInForm"

const SignIn: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <SignInForm />
    </div>
  )
}

export default SignIn