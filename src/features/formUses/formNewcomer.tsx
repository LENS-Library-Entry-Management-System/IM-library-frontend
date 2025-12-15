// React import not required with the new JSX transform
import StudentForm, { type StudentValues } from "@/components/form/formComponent"

const formNewcomer = () => {
  const handleSubmit = (values: StudentValues) => {
    // This is where you'll hook into your actual API or form handling
    console.log("Newcomer submitted", values)
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-lg font-bold">Newcomer</h2>
      <StudentForm submitText="Register" onSubmit={handleSubmit} />
    </div>
  )
}

export default formNewcomer