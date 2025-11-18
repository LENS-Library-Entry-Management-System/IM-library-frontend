import StudentForm, { type StudentValues } from "@/components/form/formComponent"
import Welcome from "@/components/dashboard/welcome"
import Logo from "@/assets/logo.svg"

const SignUp = () => {
  const handleSubmit = (values: StudentValues) => {
    console.log("SignUp submitted", values)
  }

  return (
    <div className="flex h-screen w-full">
      <div className="hidden lg:flex lg:flex-1">
        <Welcome />
      </div>

      <div className="flex w-full lg:w-[42%] items-center justify-center bg-gray-60 px-0">
        <div className="w-full max-w-xl p-6 mx-auto">
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