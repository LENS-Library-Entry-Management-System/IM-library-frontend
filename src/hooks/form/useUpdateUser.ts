import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser, type UpdateUserPayload } from '@/api/users'

export function useUpdateUser() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entries'] })
      qc.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export default useUpdateUser
