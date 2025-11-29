import client from "./client"

export type EntryRow = {
  id: string
  role: string
  firstName: string
  lastName: string
  department?: string
  college?: string
  logDate?: string
  logTime?: string
  logTimestamp?: number
  yearLevel?: string
  logId?: string
  userId?: string
  entryMethod?: string
  status?: string
  createdAt?: string
  [key: string]: unknown
}

export type GetEntriesOptions = {
  userType?: "student" | "faculty" | "all"
  query?: string
  page?: number
  limit?: number
  sort?: string
}

// Fetch entries from backend. The backend README documents a protected GET /entries endpoint.
export type EntriesResponse = {
  entries: EntryRow[]
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export async function getEntries(opts?: GetEntriesOptions): Promise<EntriesResponse> {
  try {
    // Decide whether to call the filter endpoint (POST) or the regular listing (GET)
    let responseData: unknown

    if (opts?.query) {
      const body: Record<string, unknown> = {
        searchQuery: opts.query,
        page: opts.page ?? 1,
        limit: opts.limit ?? 10,
      }
      if (opts.userType && opts.userType !== 'all') body.userType = opts.userType
      if (opts.sort) body.sort = opts.sort

      console.log('Calling POST /entries/filter with body:', body)
      console.debug('getEntries (filter) body:', body)
      const resp = await client.post('/entries/filter', body)
      responseData = resp.data
    } else {
      const params: Record<string, unknown> = {}
      if (opts?.userType && opts.userType !== 'all') params.userType = opts.userType
      if (opts?.page) params.page = opts.page
      if (opts?.limit) params.limit = opts.limit

      if (opts?.sort) {
        params.sort = opts.sort
        if (typeof opts.sort === 'string' && opts.sort.includes(':')) {
          const [byRaw, dirRaw] = opts.sort.split(':', 2)
          const by = String(byRaw ?? '')
          const dir = String(dirRaw ?? '')
          if (by) {
            params.sortBy = by
            params.sort_by = by
            params.sortField = by
          }
          if (dir) {
            params.order = dir
            params.sort_dir = dir
            params.sortDir = dir
          }

          const snake = by.replace(/\.([A-Za-z0-9_]+)/g, (_m, p1: string) => `.${p1.replace(/[A-Z]/g, (c: string) => `_${c.toLowerCase()}`)}`)
          if (snake && snake !== by) {
            params.sortBySnake = snake
            params.sort_by_snake = snake
          }
        }
      }

      console.log('Calling GET /entries with params:', params)
      console.debug('getEntries params:', params)
      const resp = await client.get('/entries', { params })
      responseData = resp.data
    }

    // Backend returns an envelope: { success, data: { entries, pagination } }
    let entriesArray: unknown[] = []
    let pagination: EntriesResponse['pagination'] | undefined

    if (Array.isArray(responseData)) {
      entriesArray = responseData
    } else if (responseData && typeof responseData === 'object') {
      const top = responseData as Record<string, unknown>
      if ('data' in top) {
        const inner = top['data'] as Record<string, unknown> | undefined
        if (inner && Array.isArray(inner['entries'])) entriesArray = inner['entries'] as unknown[]
        if (inner && typeof inner['pagination'] === 'object') {
          const p = inner['pagination'] as Record<string, unknown>
          pagination = {
            total: Number(p['total'] ?? 0),
            page: Number(p['page'] ?? opts?.page ?? 1),
            limit: Number(p['limit'] ?? opts?.limit ?? (Array.isArray(inner['entries']) ? inner['entries'].length : 0)),
            totalPages: Number(p['totalPages'] ?? Math.ceil((Number(p['total'] ?? 0) || (Array.isArray(inner['entries']) ? inner['entries'].length : 0)) / (Number(p['limit'] ?? opts?.limit ?? 1)))),
          }
        }
      } else if (Array.isArray(top['entries'])) {
        entriesArray = top['entries'] as unknown[]
      }
    }

    if (!Array.isArray(entriesArray)) entriesArray = []

    const mapped = entriesArray.map((d: unknown) => {
      const item = d as Record<string, unknown>
      const user = (item['user'] as Record<string, unknown>) || {}

      const rawTs = item['entryTimestamp'] ?? item['entry_timestamp'] ?? item['entryTimestamp']
      const timestamp = typeof rawTs === 'number' ? (rawTs as number) : rawTs ? Date.parse(String(rawTs)) : undefined

      const dateStr = timestamp ? new Date(timestamp).toLocaleDateString('en-US') : undefined
      const timeStr = timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined

      const logId = String(item['logId'] ?? item['log_id'] ?? '')

      const fallbackUserId = String(user['idNumber'] ?? user['id_number'] ?? user['rfid_tag'] ?? user['userId'] ?? item['userId'] ?? item['user_id'] ?? '')
      const id = fallbackUserId

      const role = String(user['userType'] ?? user['user_type'] ?? user['role'] ?? 'student')

      const firstName = String(user['firstName'] ?? user['first_name'] ?? '')
      const lastName = String(user['lastName'] ?? user['last_name'] ?? '')
      const department = String(user['department'] ?? '')
      const college = String(user['college'] ?? '')
      const yearLevel = String(user['yearLevel'] ?? user['year_level'] ?? '')

      const userId = String(item['userId'] ?? item['user_id'] ?? '')
      const entryMethod = String(item['entryMethod'] ?? item['entry_method'] ?? '')
      const status = String(item['status'] ?? '')
      const createdAt = item['createdAt'] ? String(item['createdAt']) : undefined

      // Important: spread the raw `item` first so normalized/derived fields below override any conflicting keys
      // This prevents raw backend fields from overwriting formatted values (logDate/logTime) or derived ids
      return {
        ...item,
        id,
        role,
        firstName,
        lastName,
        department,
        college,
        yearLevel,
        logId,
        userId,
        entryMethod,
        status,
        createdAt,
        logDate: dateStr,
        logTime: timeStr,
        logTimestamp: timestamp,
      } as EntryRow
    })

    return { entries: mapped, pagination }
  } catch (err: unknown) {
    let message = 'Failed to fetch entries'
    if (err instanceof Error) {
      message = err.message
    } else if (typeof err === 'object' && err !== null) {
      const e = err as Record<string, unknown>
      const resp = e['response'] as Record<string, unknown> | undefined
      const data = resp?.['data'] as Record<string, unknown> | undefined
      const candidate = data?.['message'] ?? data?.['error'] ?? resp?.['message']
      if (typeof candidate === 'string') message = candidate
      else if (candidate != null) message = String(candidate)
    } else {
      message = String(err)
    }
    throw new Error(message || 'Failed to fetch entries')
  }
}

export default { getEntries }
