import { useMutation, useQueryClient } from '@tanstack/react-query'
import { upsertUser } from '@/api/users'

export function useUpsertUser() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: Parameters<typeof upsertUser>[0]) => upsertUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entries'] })
      qc.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export default useUpsertUser
