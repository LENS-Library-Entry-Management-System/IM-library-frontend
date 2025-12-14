import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import StudentForm, { type StudentValues } from '@/components/form/formComponent'
import Welcome from '@/components/dashboard/welcome'
import Logo from '@/assets/logo.svg'
import { useQuery } from '@tanstack/react-query'
import { getUserByToken } from '@/api/users'
import { useUpsertUser } from '@/hooks/form/useUpsertUser'

const EntryForm = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? undefined
  const [showCloseMessage, setShowCloseMessage] = useState(false)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['formByToken', token],
    queryFn: () => getUserByToken(String(token)),
    enabled: !!token,
  })

  const upsert = useUpsertUser()

  const initialValues = useMemo(() => {
    const payload = data?.data ?? null
    if (!payload) return undefined
    const iv: StudentValues = {
      studentId: payload.idNumber ?? '',
      firstName: payload.firstName ?? '',
      lastName: payload.lastName ?? '',
      college: payload.college ?? '',
      department: payload.department ?? '',
      yearLevel: payload.yearLevel ?? '',
      userType: payload.userType ?? 'student',
      email: payload.email ?? '',
    }
    return iv
  }, [data])

  useEffect(() => {
    if (!token) return
    // optionally handle token not found case from backend
  }, [token])

  const handleSubmit = (values: StudentValues) => {
    const payload = {
      token,
      rfidTag: data?.data?.rfidTag,
      idNumber: values.studentId ?? '',
      firstName: values.firstName ?? '',
      lastName: values.lastName ?? '',
      college: values.college ?? '',
      department: values.department ?? '',
      yearLevel: values.yearLevel ?? '',
      userType: values.userType ?? 'student',
      status: data?.data?.status ?? 'active',
      ...(values.email?.trim() ? { email: values.email.trim() } : {}),
    }

    upsert.mutate(payload, {
      onSuccess: () => {
        alert('User created/updated successfully')
        // Try to close the tab (works if opened by script). If blocked,
        // show a friendly message instructing the user they may close the page.
        try {
          window.close()
        } catch {
          // ignore
        }

        setTimeout(() => {
          try {
            if (typeof window !== 'undefined' && window.closed) {
              // already closed
              return
            }
          } catch {
            // ignore
          }
          // If still open, show the close instruction message instead of navigating away.
          setShowCloseMessage(true)
        }, 300)
      },
      onError: () => {
        alert('Token expired')
      },
    })
  }

  if (!token) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Token missing</h2>
        <p className="text-sm text-gray-500">No token provided in query params.</p>
      </div>
    )
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  if (isError) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Failed to load token data</h2>
        <p className="text-sm text-red-500">{String((error as Error)?.message ?? error)}</p>
      </div>
    )
  }

  const payload = data?.data ?? null
  const displayName = payload ? `${payload.firstName ?? ''} ${payload.lastName ?? ''}`.trim() : ''

  if (showCloseMessage) {
    return (
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-4">You may now close this page</h2>
          <p className="text-sm text-muted-foreground mb-6">The user has been created/updated successfully.</p>
          <div className="flex justify-center">
            <button
              onClick={() => {
                try {
                  window.close()
                } catch {
                  // ignore
                }
              }}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded"
            >
              Close this page
            </button>
          </div>
        </div>
      </div>
    )
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
            <h1 className="text-5xl font-extrabold text-gradient">{displayName || 'Student'}</h1>
            <h3 className="text-sm font-light text-gray-400">
              {initialValues
                ? 'Please edit your information below'
                : 'Please complete your information below'}
            </h3>
          </div>
          
          <StudentForm initialValues={initialValues} submitText={upsert.status === 'pending' ? 'Saving...' : 'Save'} onSubmit={handleSubmit} />
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

export default EntryForm
