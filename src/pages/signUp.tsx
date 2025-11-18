import StudentForm, { type StudentValues } from "@/components/form/formComponent"
import Welcome from "@/components/dashboard/welcome"
import Logo from "@/assets/logo.svg"

const SignUp = () => {
  const handleSubmit = (values: StudentValues) => {
    console.log("SignUp submitted", values)
  }

  return (
    <div className="flex h-screen w-full">
      {/* Left Side - Blue Section - Takes more space */}
      <div className="hidden lg:flex lg:flex-1">
        <Welcome />
      </div>

      {/* Right Side - Form Section - Takes less space */}
      <div className="flex flex-1 lg:flex-0.8 items-center justify-center bg-gray-50 px-0">
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-gray-400">Welcome,</h2>
            <h1 className="text-5xl font-extrabold text-gradient">Student</h1>
          </div>
          
          <StudentForm submitText="Sign Up" onSubmit={handleSubmit} />
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

export default SignUp