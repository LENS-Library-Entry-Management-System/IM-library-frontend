import { useState, type ChangeEvent, type FormEvent } from "react"

import { Field, FieldLabel, FieldContent, FieldTitle, FieldDescription, FieldError, FieldGroup, FieldSet, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { yearLevels, colleges, departmentsByCollege } from "@/lib/colleges"

export type StudentValues = {
  studentId?: string
  firstName?: string
  lastName?: string
  department?: string
  college?: string
  yearLevel?: string
}

type StudentFormProps = {
  initialValues?: StudentValues
  submitText?: string
  onSubmit?: (values: StudentValues) => void
  className?: string
}

const defaultValues: StudentValues = {
  studentId: "",
  firstName: "",
  lastName: "",
  department: "",
  college: "",
  yearLevel: "",
}

export function StudentForm({
  initialValues = {},
  submitText = "Submit",
  onSubmit,
  className,
}: StudentFormProps) {
  const [values, setValues] = useState<StudentValues>({ ...defaultValues, ...initialValues })
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})

  const handleChange = (key: keyof StudentValues) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  // Data (yearLevels, colleges, departmentsByCollege) are imported from `@/lib/colleges`

  const collegesWithoutDepartment = new Set(["College of Medicine", "Senior High School"])
  const availableDepartments = values.college && !collegesWithoutDepartment.has(values.college) ? departmentsByCollege[values.college] ?? [] : []

  const validate = (v: StudentValues) => {
    const newErrors: Record<string, string | undefined> = {}
    if (!v.studentId || v.studentId.trim() === "") newErrors.studentId = "Student ID is required"
    if (!v.lastName || v.lastName.trim() === "") newErrors.lastName = "Last name is required"
    if (!v.firstName || v.firstName.trim() === "") newErrors.firstName = "First name is required"
    // Require department only when it applies for the selected college
    if (v.college && !collegesWithoutDepartment.has(v.college)) {
      const deptOptions = departmentsByCollege[v.college] ?? []
      if (deptOptions.length > 0 && (!v.department || v.department.trim() === "")) {
        newErrors.department = "Department is required for the selected college"
      }
    }
    return newErrors
  }

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault()
    const newErrors = validate(values)
    setErrors(newErrors)
    const isValid = Object.keys(newErrors).length === 0
    if (isValid) {
      onSubmit?.(values)
    }
  }

  // const fieldError = useMemo(() => Object.values(errors).filter(Boolean) as string[], [errors])

  return (
    <form
      className={cn("w-full max-w-3xl space-y-6", className)}
      onSubmit={handleSubmit}
      noValidate
    >
      <FieldSet>
        <FieldGroup>
          <Field data-invalid={!!errors.studentId}>
            <FieldLabel>
              <FieldTitle>Student ID</FieldTitle>
              <FieldDescription>Enter your student identification number</FieldDescription>
            </FieldLabel>
            <FieldContent>
              <Input
                name="studentId"
                value={values.studentId}
                onChange={handleChange("studentId")}
                placeholder="Text Here"
                aria-invalid={!!errors.studentId}
                aria-describedby={errors.studentId ? "studentId-error" : undefined}
              />
              <FieldError errors={errors.studentId ? [{ message: errors.studentId }] : []} id={errors.studentId ? "studentId-error" : undefined} />
            </FieldContent>
          </Field>

          <div className="flex gap-4">
            <Field className="flex-1" data-invalid={!!errors.lastName}>
              <FieldLabel>
                <FieldTitle>Last Name</FieldTitle>
                <FieldDescription>Family name</FieldDescription>
              </FieldLabel>
              <FieldContent>
                <Input
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange("lastName")}
                  placeholder="Text Here"
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                />
                <FieldError errors={errors.lastName ? [{ message: errors.lastName }] : []} id={errors.lastName ? "lastName-error" : undefined} />
              </FieldContent>
            </Field>

            <Field className="flex-1" data-invalid={!!errors.firstName}>
              <FieldLabel>
                <FieldTitle>First Name</FieldTitle>
                <FieldDescription>Given name</FieldDescription>
              </FieldLabel>
              <FieldContent>
                <Input
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange("firstName")}
                  placeholder="Text Here"
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                />
                <FieldError errors={errors.firstName ? [{ message: errors.firstName }] : []} id={errors.firstName ? "firstName-error" : undefined} />
              </FieldContent>
            </Field>
          </div>

          <Field data-invalid={!!errors.college}>
            <FieldLabel>
              <FieldTitle>College</FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Select
                name="college"
                value={values.college}
                onChange={(e) => {
                  handleChange("college")(e as ChangeEvent<HTMLSelectElement>)
                  // clear department when college changes
                  setValues((prev) => ({ ...prev, department: "" }))
                }}
                aria-describedby={errors.college ? "college-error" : undefined}
              >
                <option value="">Select College</option>
                {colleges.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
              <FieldError errors={errors.college ? [{ message: errors.college }] : []} id={errors.college ? "college-error" : undefined} />
            </FieldContent>
          </Field>

          <Field data-invalid={!!errors.department}>
            <FieldLabel>
              <FieldTitle>Department</FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Select
                name="department"
                value={values.department}
                onChange={handleChange("department")}
                aria-describedby={errors.department ? "department-error" : undefined}
                disabled={!values.college || collegesWithoutDepartment.has(values.college)}
              >
                <option value="">Select Department</option>
                {availableDepartments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
              <FieldError errors={errors.department ? [{ message: errors.department }] : []} id={errors.department ? "department-error" : undefined} />
            </FieldContent>
          </Field>

          <Field data-invalid={!!errors.yearLevel}>
            <FieldLabel>
              <FieldTitle>Year Level</FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Select
                name="yearLevel"
                value={values.yearLevel}
                onChange={handleChange("yearLevel")}
                aria-describedby={errors.yearLevel ? "yearLevel-error" : undefined}
              >
                <option value="">Select Year Level</option>
                {yearLevels.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Select>
              <FieldError errors={errors.yearLevel ? [{ message: errors.yearLevel }] : []} id={errors.yearLevel ? "yearLevel-error" : undefined} />
            </FieldContent>
          </Field>

          <FieldSeparator />

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setValues({ ...defaultValues, ...initialValues })}>
              Reset
            </Button>
            <Button type="submit">{submitText}</Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}

export default StudentForm