import { useQuery } from '@tanstack/react-query'
import { getEntries } from '@/api/entries'

export type UseEntriesParams = {
  userType?: 'student' | 'faculty' | 'all'
  query?: string
  page?: number
  limit?: number
  sort?: string
  yearLevel?: string
}

export function useEntries(params: UseEntriesParams, options?: { enabled?: boolean }) {
  const { userType, query, page = 1, limit = 10, sort } = params

  const key = ['entries', userType ?? 'all', query ?? '', page, limit, sort ?? '', params.yearLevel ?? ''] as const

  return useQuery({
    queryKey: key,
    queryFn: () => getEntries({ userType, query, page, limit, sort, yearLevel: params.yearLevel }),
    staleTime: 1000 * 30, // 30s
    enabled: options?.enabled ?? true,
  })
}
