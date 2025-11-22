// React import required for hooks/types in this module
import * as React from 'react'
import Welcome from "@/components/dashboard/welcome"
import Logo from "@/assets/logo.svg"
import StudentForm, { type StudentValues } from "@/components/form/formComponent"
import { useUpdateUser } from "@/hooks/form/useUpdateUser"
import { useLocation, useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()

  // If this page is opened without a valid userId (malformed navigation or direct visit),
  // redirect back to the records list instead of silently mutating a placeholder user.
  React.useEffect(() => {
    if (!state.userId) {
      // Optionally we could show an inline error; redirecting keeps the UX simple.
      navigate('/records', { replace: true })
    }
  }, [state.userId, navigate])

  const handleSubmit = (values: StudentValues) => {
    // Require a valid userId. If missing, abort and navigate back.
    const userId = state.userId
    if (!userId) {
      alert('No user selected for editing. Returning to records.')
      navigate('/records', { replace: true })
      return
    }

    const payload = {
      userId,
      idNumber: values.studentId ?? '',
      // Do not include rfidTag unless explicitly editing it; this avoids accidental uniqueness conflicts.
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