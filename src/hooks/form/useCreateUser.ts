import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser, type CreateUserPayload } from '@/api/users'

export function useCreateUser() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      // Invalidate entries and users caches
      qc.invalidateQueries({ queryKey: ['entries'] })
      qc.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export default useCreateUser
