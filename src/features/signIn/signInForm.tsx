import React, { useState } from "react"

import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

const SignInForm: React.FC = () => {
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ userId?: string; password?: string } | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const newErrors: { userId?: string; password?: string } = {}
    if (!userId.trim()) newErrors.userId = "User ID is required"
    if (!password.trim()) newErrors.password = "Password is required"

    setErrors(Object.keys(newErrors).length ? newErrors : null)

    if (!Object.keys(newErrors).length) {
      // TODO: call sign-in API or dispatch auth action
      console.log("submit", { userId, password })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-primary">Hello Admin!</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome Back</p>
      </header>

      <Field className="mb-3">
        <FieldLabel>
          <span className="text-sm text-muted-foreground">User ID</span>
        </FieldLabel>
        <FieldContent>
          <Input
            aria-label="User ID"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </FieldContent>
        {errors?.userId && <FieldError>{errors.userId}</FieldError>}
      </Field>

      <Field className="mb-6">
        <FieldLabel>
          <span className="text-sm text-muted-foreground">Password</span>
        </FieldLabel>
        <FieldContent>
          <div className="relative w-full">
            <Input
              type={showPassword ? "text" : "password"}
              aria-label="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />

            <Button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2"
              variant="ghost"
              size="icon"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </FieldContent>
        {errors?.password && <FieldError>{errors.password}</FieldError>}
      </Field>

      <Button type="submit" className="w-full rounded-full h-12" variant="default">
        Login
      </Button>

      <div className="mt-4 text-center">
        <a className="text-sm text-muted-foreground hover:text-primary" href="#">
          Forgot Password
        </a>
      </div>
    </form>
  )
}

export default SignInForm