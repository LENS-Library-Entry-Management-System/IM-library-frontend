// React import not required with the new JSX transform
import Welcome from "@/components/dashboard/welcome"
import Logo from "@/assets/logo.svg"
import StudentForm, { type StudentValues } from "@/components/form/formComponent"

const editInfo = () => {
  const initial: StudentValues = {
    studentId: "2020-98765",
    firstName: "Jane",
    lastName: "Smith",
    department: "Information Technology",
    college: "School of IT",
    yearLevel: "2nd Year",
  }

  const handleSubmit = (values: StudentValues) => {
    console.log("Edit Info submitted", values)
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
            <h2 className="text-3xl font-light text-gray-400">Edit Info</h2>
            <h1 className="text-5xl font-extrabold text-gradient">Student</h1>
          </div>
      <StudentForm initialValues={initial} submitText="Save" onSubmit={handleSubmit} />
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

export default editInfo