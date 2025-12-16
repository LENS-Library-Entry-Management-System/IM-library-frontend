import StudentForm, { type StudentValues } from "@/components/form/formComponent"
import Welcome from "@/components/dashboard/welcome"
import { useCreateUser } from "@/hooks/form/useCreateUser"
import { toast } from "sonner"

const SignUp = () => {
  const create = useCreateUser()

  const handleSubmit = (values: StudentValues) => {
    // Map StudentValues to API payload
    // NOTE: RFID scanning is not yet available in the dev environment. We generate
    // a per-request development placeholder to avoid collisions during testing.
    // Replace this with the real scanned tag when integration is ready.
    const devRfid = `DEV-RFID-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const payload = {
      idNumber: values.studentId ?? '',
      rfidTag: devRfid,
      firstName: values.firstName ?? '',
      lastName: values.lastName ?? '',
      college: values.college,
      department: values.department,
      yearLevel: values.yearLevel,
      userType: 'student' as const,
    }

    create.mutate(payload, {
      onSuccess: () => {
        toast.success('Student account created successfully')
      },
      onError: (err: unknown) => {
        toast.error('Create failed: ' + String((err as Error)?.message ?? err))
      },
    })
  }

  return (
    <div className="flex h-screen w-full">
      <div className="hidden lg:flex lg:flex-1">
        <Welcome />
      </div>

      <div className="flex w-full lg:w-[45%] items-center justify-center bg-gray-60 px-0">
        <div className="w-full max-w-xl p-6 mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-gray-400">Welcome,</h2>
            <h1 className="text-5xl font-extrabold text-gradient">Student</h1>
          </div>
          
          <StudentForm submitText="Sign Up" onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

export default SignUp