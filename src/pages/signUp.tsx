// React import not required with the new JSX transform
import StudentForm, { type StudentValues } from "@/components/form/formComponent"

const signUp = () => {
  const handleSubmit = (values: StudentValues) => {
    console.log("SignUp submitted", values)
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Welcome, Student</h1>
      <StudentForm submitText="Sign Up" onSubmit={handleSubmit} />
    </div>
  )
}

export default signUp