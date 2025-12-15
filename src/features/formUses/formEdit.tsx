// React import not required with the new JSX transform
import StudentForm, { type StudentValues } from "@/components/form/formComponent"

const formEdit = () => {
  const initial: StudentValues = {
    studentId: "2025-12345",
    firstName: "John",
    lastName: "Doe",
    department: "Computer Science",
    college: "School of Computing",
    yearLevel: "3rd Year",
  }

  const handleSubmit = (values: StudentValues) => {
    console.log("Edit submitted", values)
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-lg font-bold">Edit Student</h2>
      <StudentForm initialValues={initial} submitText="Save Changes" onSubmit={handleSubmit} />
    </div>
  )
}

export default formEdit