// React import not required with the new JSX transform
import Welcome from "@/components/dashboard/welcome"
import Logo from "@/assets/logo.svg"
import StudentForm, { type StudentValues } from "@/components/form/formComponent"
import { useUpdateUser } from "@/hooks/form/useUpdateUser"
import { useLocation } from 'react-router-dom'

const EditInfo = () => {
  const location = useLocation()
  const state = (location.state ?? {}) as { userId?: number | string; initialValues?: StudentValues }

  const initial: StudentValues = {
    studentId: state.initialValues?.studentId ?? "",
    firstName: state.initialValues?.firstName ?? "",
    lastName: state.initialValues?.lastName ?? "",
    department: state.initialValues?.department ?? "",
    college: state.initialValues?.college ?? "",
    yearLevel: state.initialValues?.yearLevel ?? "",
  }

  const update = useUpdateUser()

  const handleSubmit = (values: StudentValues) => {
    // Use userId passed in location.state when available
    const userId = state.userId ?? 123 // fallback placeholder
    const payload = {
      userId,
      idNumber: values.studentId ?? '',
      // Do not include rfidTag here unless intentionally changing it; leaving undefined avoids unnecessary uniqueness checks
      firstName: values.firstName ?? '',
      lastName: values.lastName ?? '',
      college: values.college,
      department: values.department,
      yearLevel: values.yearLevel,
    }

    update.mutate(payload, {
      onSuccess: () => {
        alert('Student information updated.')
      },
      onError: (err: unknown) => {
        alert('Update failed: ' + String((err as Error)?.message ?? err))
      },
    })
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

export default EditInfo