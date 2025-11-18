import React from "react"
import SignInForm from "@/features/signIn/signInForm"
import Welcome from "@/components/dashboard/welcome"
import Logo from "@/assets/logo.svg"

const SignIn: React.FC = () => {
  return (
    <div className="flex h-screen w-full">
      
      <div className="hidden lg:flex lg:flex-1">
        <Welcome />
      </div>
      <div className="flex w-full lg:w-[40%] items-center justify-center bg-gray-60 px-0">
        <div className="w-full max-w-xl p-6 mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl font-extrabold text-gradient">Hello Admin!</h1>
            <h2 className="text-1xl font-light text-gray-400">Welcome Back</h2>
          </div>
          
          <SignInForm />
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center lg:hidden">
          <img
            src={Logo}
            alt="LENS Logo"
            className="w-30 h-auto"
          />
        </div>
      </div>
    </div>
  )
}
export default SignIn