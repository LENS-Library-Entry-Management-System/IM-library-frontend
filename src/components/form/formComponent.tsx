import { useState, type ChangeEvent, type FormEvent } from "react"

import {
  Field,
  FieldContent,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { yearLevels, colleges, departmentsByCollege } from "@/lib/colleges"
import Logo from "@/assets/logo.svg"

export type StudentValues = {
  studentId?: string
  firstName?: string
  lastName?: string
  department?: string
  college?: string
  yearLevel?: string
  userType?: 'student' | 'faculty'
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
  userType: "student",
}

export function StudentForm({
  initialValues = {},
  submitText = "Submit",
  onSubmit,
  className,
}: StudentFormProps) {
  const [values, setValues] = useState<StudentValues>({
    ...defaultValues,
    ...initialValues,
  })
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})

  const handleChange =
    (key: keyof StudentValues) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [key]: e.target.value }))
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }

  const collegesWithoutDepartment = new Set([
    "College of Medicine",
    "Senior High School",
  ])

  const availableDepartments =
    values.college && !collegesWithoutDepartment.has(values.college)
      ? departmentsByCollege[values.college] ?? []
      : []

  const validate = (v: StudentValues) => {
    const newErrors: Record<string, string | undefined> = {}
    if (!v.studentId?.trim()) newErrors.studentId = v.userType === 'faculty' ? "Faculty ID is required" : "Student ID is required"
    if (!v.lastName?.trim()) newErrors.lastName = "Last name is required"
    if (!v.firstName?.trim()) newErrors.firstName = "First name is required"

    if (v.userType === 'student') {
      if (!v.college?.trim()) newErrors.college = "College is required"
      if (!v.yearLevel?.trim()) newErrors.yearLevel = "Year level is required"

      if (v.college && !collegesWithoutDepartment.has(v.college)) {
        const deptOptions = departmentsByCollege[v.college] ?? []
        if (deptOptions.length > 0 && !v.department?.trim()) {
          newErrors.department = "Department is required"
        }
      }
    }
    return newErrors
  }

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault()
    const newErrors = validate(values)
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      onSubmit?.(values)
    }
  }

  const legendClass =
    "absolute -top-3 left-4 bg-gray-50 px-2 text-primary font-semibold text-sm rounded"

  const wrapperClass =
    "relative border border-gray-300 rounded-md px-4 pt-4 pb-2"

  return (
    <div
      className={cn("w-full max-w-xl mx-auto space-y-6", className)}
      onSubmit={handleSubmit}
    >
      {/* Logo - shown at top on mobile, hidden on desktop */}
      <div className="flex justify-center mb-4 md:hidden">
        <img
          src={Logo}
          alt="LENS Logo"
          className="w-30 h-auto"
        />
      </div>
      <FieldSet>
        <FieldGroup>
          {/* USER TYPE */}
          <Field data-invalid={!!errors.userType}>
            <div className="relative">
              {errors.userType && (
                <div className="absolute -top-2 left-4 z-10 bg-red-500 text-white text-xs px-3 py-1.5 rounded shadow-lg">
                  <div className="absolute -bottom-1 left-4 w-2 h-2 bg-red-500 transform rotate-45"></div>
                  {errors.userType}
                </div>
              )}
              <div className={cn(wrapperClass, errors.userType && "border-red-500")}>
                <span className={legendClass}>User Type</span>
                <FieldContent>
                  <Select
                    name="userType"
                    value={values.userType}
                    onChange={handleChange("userType")}
                    aria-describedby={errors.userType ? "userType-error" : undefined}
                    className="border-0 shadow-none p-2 focus:ring-0 focus-visible:ring-0"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                  </Select>
                </FieldContent>
              </div>
            </div>
          </Field>

          {/* STUDENT ID */}
          <Field data-invalid={!!errors.studentId}>
            <div className="relative">
              {errors.studentId && (
                <div className="absolute -top-2 left-4 z-10 bg-red-500 text-white text-xs px-3 py-1.5 rounded shadow-lg">
                  <div className="absolute -bottom-1 left-4 w-2 h-2 bg-red-500 transform rotate-45"></div>
                  {errors.studentId}
                </div>
              )}
              <div className={cn(wrapperClass, errors.studentId && "border-red-500")}>
                <span className={legendClass}>{values.userType === 'faculty' ? 'Faculty ID' : 'Student ID'}</span>
                <FieldContent>
                  <Input
                    name="studentId"
                    value={values.studentId}
                    onChange={handleChange("studentId")}
                    placeholder="Text Here"
                    aria-invalid={!!errors.studentId}
                    aria-describedby={errors.studentId ? "studentId-error" : undefined}
                    className="border-0 shadow-none p-2 focus:ring-0 focus-visible:ring-0"
                  />
                </FieldContent>
              </div>
            </div>
          </Field>

          {/* NAME FIELDS */}
          <div className="flex gap-4">
            {/* LAST NAME */}
            <Field className="flex-1" data-invalid={!!errors.lastName}>
              <div className="relative">
                {errors.lastName && (
                  <div className="absolute -top-2 left-4 z-10 bg-red-500 text-white text-xs px-3 py-1.5 rounded shadow-lg">
                    <div className="absolute -bottom-1 left-4 w-2 h-2 bg-red-500 transform rotate-45"></div>
                    {errors.lastName}
                  </div>
                )}
                <div className={cn(wrapperClass, errors.lastName && "border-red-500")}>
                  <span className={legendClass}>Last Name</span>
                  <FieldContent>
                    <Input
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange("lastName")}
                      placeholder="Text Here"
                      aria-invalid={!!errors.lastName}
                      aria-describedby={errors.lastName ? "lastName-error" : undefined}
                      className="border-0 shadow-none p-2 focus:ring-0 focus-visible:ring-0"
                    />
                  </FieldContent>
                </div>
              </div>
            </Field>

            {/* FIRST NAME */}
            <Field className="flex-1" data-invalid={!!errors.firstName}>
              <div className="relative">
                {errors.firstName && (
                  <div className="absolute -top-2 left-4 z-10 bg-red-500 text-white text-xs px-3 py-1.5 rounded shadow-lg">
                    <div className="absolute -bottom-1 left-4 w-2 h-2 bg-red-500 transform rotate-45"></div>
                    {errors.firstName}
                  </div>
                )}
                <div className={cn(wrapperClass, errors.firstName && "border-red-500")}>
                  <span className={legendClass}>First Name</span>
                  <FieldContent>
                    <Input
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange("firstName")}
                      placeholder="Text Here"
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? "firstName-error" : undefined}
                      className="border-0 shadow-none p-2 focus:ring-0 focus-visible:ring-0"
                    />
                  </FieldContent>
                </div>
              </div>
            </Field>
          </div>

          {/* COLLEGE */}
          <Field data-invalid={!!errors.college}>
            <div className="relative">
              {errors.college && (
                <div className="absolute -top-2 left-4 z-10 bg-red-500 text-white text-xs px-3 py-1.5 rounded shadow-lg">
                  <div className="absolute -bottom-1 left-4 w-2 h-2 bg-red-500 transform rotate-45"></div>
                  {errors.college}
                </div>
              )}
              <div className={cn(wrapperClass, errors.college && "border-red-500")}>
                <span className={legendClass}>College</span>
                <FieldContent>
                  <Select
                    name="college"
                    value={values.college}
                    onChange={(e) => {
                      handleChange("college")(e as ChangeEvent<HTMLSelectElement>)
                      setValues((prev) => ({ ...prev, department: "" }))
                    }}
                    aria-describedby={errors.college ? "college-error" : undefined}
                    className="border-0 shadow-none p-2 focus:ring-0 focus-visible:ring-0"
                  >
                    <option value="">Select College</option>
                    {colleges.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </FieldContent>
              </div>
            </div>
          </Field>

          {/* DEPARTMENT */}
          <Field data-invalid={!!errors.department}>
            <div className="relative">
              {errors.department && (
                <div className="absolute -top-2 left-4 z-10 bg-red-500 text-white text-xs px-3 py-1.5 rounded shadow-lg">
                  <div className="absolute -bottom-1 left-4 w-2 h-2 bg-red-500 transform rotate-45"></div>
                  {errors.department}
                </div>
              )}
              <div className={cn(wrapperClass, errors.department && "border-red-500")}>
                <span className={legendClass}>Department</span>
                <FieldContent>
                  <Select
                    name="department"
                    value={values.department}
                    onChange={handleChange("department")}
                    disabled={
                      !values.college ||
                      collegesWithoutDepartment.has(values.college)
                    }
                    aria-describedby={errors.department ? "department-error" : undefined}
                    className="border-0 shadow-none p-2 focus:ring-0 focus-visible:ring-0"
                  >
                    <option value="">Select Department</option>
                    {availableDepartments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </Select>
                </FieldContent>
              </div>
            </div>
          </Field>

          {/* YEAR LEVEL */}
          {values.userType === 'student' && (
          <Field data-invalid={!!errors.yearLevel}>
            <div className="relative">
              {errors.yearLevel && (
                <div className="absolute -top-2 left-4 z-10 bg-red-500 text-white text-xs px-3 py-1.5 rounded shadow-lg">
                  <div className="absolute -bottom-1 left-4 w-2 h-2 bg-red-500 transform rotate-45"></div>
                  {errors.yearLevel}
                </div>
              )}
              <div className={cn(wrapperClass, errors.yearLevel && "border-red-500")}>
                <span className={legendClass}>Year Level</span>
                <FieldContent>
                  <Select
                    name="yearLevel"
                    value={values.yearLevel}
                    onChange={handleChange("yearLevel")}
                    aria-describedby={errors.yearLevel ? "yearLevel-error" : undefined}
                    className="border-0 shadow-none p-2 focus:ring-0 focus-visible:ring-0"
                  >
                    <option value="">Select Year Level</option>
                    {yearLevels.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </Select>
                </FieldContent>
              </div>
            </div>
          </Field>
          )}

          {/* Logo - shown after Year Level on mobile, hidden on desktop */}
          <div className="flex justify-center my-6 md:hidden">
            <img
              src={Logo}
              alt="LENS Logo"
              className="w-30 h-auto"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              className="
                inline-flex items-center gap-2
                h-9
                border border-primary
                bg-white
                px-5 py-2.5
                text-primary
                hover:bg-blue-50
              "
              onClick={() =>
                setValues({ ...defaultValues, ...initialValues })
              }
            >
              Clear
            </Button>
            <Button type="submit" onClick={handleSubmit} className="bg-primary text-white hover:bg-primary-foreground ">{submitText}</Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}

export default StudentForm