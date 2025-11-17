// React import not required with the new JSX transform
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
    <div className="p-6">
      <h1 className="mb-4 text-lg font-bold">Edit Info</h1>
      <StudentForm initialValues={initial} submitText="Save" onSubmit={handleSubmit} />
    </div>
  )
}

export default editInfo