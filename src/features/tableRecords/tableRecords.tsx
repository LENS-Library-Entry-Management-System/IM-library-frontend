import * as React from "react"
import { useNavigate } from "react-router-dom"
import ReusableTable from "@/components/table/reusableTable"
import { rows as mockRows } from "@/mockData/records"
import { columns } from "./columns"
import { useLayout } from "@/components/layout/useLayout"
import { type SortOption, useSort } from "@/components/table/sortStore"
import { useSearch } from "@/components/table/searchStore"
import { type EntryRow } from "@/api/entries"
import { useEntries } from "@/hooks/tableRecords/useEntries"
import { deleteEntriesByLogIds } from "@/api/entries"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTableSelection } from "@/components/table/SelectionContext"

type Row = {
  id: string
  role: string
  firstName?: string
  lastName?: string
  department?: string
  college?: string
  logDate?: string
  logTime?: string
  logTimestamp?: number
}

const sortRows = (rowsData: Row[], option: SortOption) => {
  const copy = [...rowsData]
  const getTs = (r: Row) =>
    typeof r.logTimestamp === "number"
      ? r.logTimestamp
      : (() => {
          const [m, d, y] = String(r.logDate || "").split("/").map((n) => Number(n) || 0)
          if (!m || !d || !y) return 0
          return new Date(y, m - 1, d).getTime()
        })()
  switch (option) {
    case "date_desc":
      return copy.sort((a, b) => getTs(b) - getTs(a))
    case "date_asc":
      return copy.sort((a, b) => getTs(a) - getTs(b))
    case "time_desc":
      return copy.sort((a, b) => {
        const [ah, am] = String(a.logTime || "0:0").split(":").map((n) => Number(n) || 0)
        const [bh, bm] = String(b.logTime || "0:0").split(":").map((n) => Number(n) || 0)
        return bh * 60 + bm - (ah * 60 + am)
      })
    case "time_asc":
      return copy.sort((a, b) => {
        const [ah, am] = String(a.logTime || "0:0").split(":").map((n) => Number(n) || 0)
        const [bh, bm] = String(b.logTime || "0:0").split(":").map((n) => Number(n) || 0)
        return ah * 60 + am - (bh * 60 + bm)
      })
    case "name_az":
      return copy.sort((a, b) => {
        const al = String(a.lastName || "").localeCompare(String(b.lastName || ""))
        if (al !== 0) return al
        return String(a.firstName || "").localeCompare(String(b.firstName || ""))
      })
    case "name_za":
      return copy.sort((a, b) => {
        const al = String(b.lastName || "").localeCompare(String(a.lastName || ""))
        if (al !== 0) return al
        return String(b.firstName || "").localeCompare(String(a.firstName || ""))
      })
    default:
      return copy
  }
}

const TableRecords = () => {
  const { sort } = useSort()
  const { query } = useSearch()

  const { section } = useLayout()

  const [page, setPage] = React.useState<number>(1)


  // Map UI sort option to backend sort parameter
  const mapSortToBackend = React.useCallback((s: SortOption | undefined) => {
    switch (s) {
      case "date_desc":
        return "entryTimestamp:desc"
      case "date_asc":
        return "entryTimestamp:asc"
      case "time_desc":
        return "entryTimestamp:desc"
      case "time_asc":
        return "entryTimestamp:asc"
      case "name_az":
        return "user.lastName:asc"
      case "name_za":
        return "user.lastName:desc"
      default:
        return undefined
    }
  }, [])

  // Use TanStack Query hook to fetch entries from the backend. The hook caches
  // and manages loading/refresh behavior; we send section/query/sort/page as keys.
  const backendSort = mapSortToBackend(sort)
  const userType = section === "Students" ? "student" : section === "Faculties" ? "faculty" : "all"
  const entriesQuery = useEntries({ userType, query: String(query || "") || undefined, limit: 10, page, sort: backendSort })

  const isLoading = entriesQuery.isLoading
  const isError = entriesQuery.isError
  const errorObj = entriesQuery.error
  const resp = entriesQuery.data
  const total = resp?.pagination?.total
  const data = resp?.entries ?? null

  // Reset to first page when filters or sort change
  React.useEffect(() => {
    setPage(1)
  }, [section, query, sort])

  const navigate = useNavigate()

  const rowsSource = React.useMemo<EntryRow[]>(() => {
    // If the fetch errored, do not fall back to mock rows — show empty state so failures are visible.
    if (isError) return []
    if (data) return data
    if (isLoading) return []
    return mockRows as unknown as EntryRow[]
  }, [data, isLoading, isError])

  // When using server-side fetching, the backend returns already-filtered and sorted rows.
  // Avoid applying client-side filter/sort in that case. This keeps behavior consistent with
  // production rules where filters and sort are applied by the API.
  const useServerSide = true

  const displayedRows = React.useMemo(() => {
    if (useServerSide) return rowsSource

    const q = String(query || "").trim().toLowerCase()
    // First filter rows based on the sidebar section selection (Students, Faculties, All)
    const filteredBySection = rowsSource.filter((r) => {
      if (section === "Students") return r.role === "student"
      if (section === "Faculties") return r.role === "faculty"
      return true
    })

    if (!q) return filteredBySection
    return filteredBySection.filter((r) => {
      const fields = [r.id, r.firstName, r.lastName, r.department, r.college, r.logDate, r.logTime]
      return fields.some((f) => String(f ?? "").toLowerCase().includes(q))
    })
  }, [rowsSource, query, section, useServerSide])

  const sorted = React.useMemo(() => {
    if (useServerSide) return displayedRows
    return sortRows(displayedRows, sort)
  }, [displayedRows, sort, useServerSide])

  // Map columns to update the 'id' header label based on the selected section
  const mappedColumns = React.useMemo(() => {
    return columns.map((c) => {
      if (c.key === "id") {
        const header = section === "Students" ? "Student ID" : section === "Faculties" ? "Faculty ID" : "ID"
        return { ...c, header }
      }
      return c
    })
  }, [section])

  // Selection + deletion wiring
  const { selected, setOnDelete } = useTableSelection()
  const qc = useQueryClient()
  const bulkDelete = useMutation({
    mutationFn: async () => {
      const ids = selected
        .map((s) => s.logId)
        .filter((v): v is string => typeof v === 'string' && v.trim() !== '')
      if (ids.length === 0) {
        alert('No selectable entries on this page. Try another page.')
        return
      }
      await deleteEntriesByLogIds(ids)
    },
    onSuccess: () => {
      // Align with useEntries queryKey: ['entries', userType, query, page, limit, sort]
      qc.invalidateQueries({ queryKey: ['entries', userType ?? 'all', String(query ?? ''), page, 10, backendSort ?? ''] })
    },
    onError: (err) => {
      console.error('Bulk delete failed', err)
      alert('Delete failed. Please try again.')
    },
  })

  React.useEffect(() => {
    // Provide a callable that directly invokes mutateAsync
    setOnDelete(async () => {
      await bulkDelete.mutateAsync()
    })
  }, [setOnDelete, bulkDelete])

  return (
    <div>
      {isError ? <div className="mb-2 text-sm text-destructive">Error: {String((errorObj as Error)?.message ?? errorObj)}</div> : null}
      {isLoading ? <div className="mb-2 text-sm text-muted-foreground">Loading entries...</div> : null}
      <ReusableTable
        data={sorted}
        columns={mappedColumns}
        pageSize={10}
        showSelection
        showActions
        onEdit={(row) => {
          // Map an entry row to the edit page initial values and navigate
          const r = row as Record<string, unknown>
          const userId = (r['userId'] ?? r['user_id'] ?? r['id']) as string | undefined
          const initialValues = {
            studentId: String(r['id'] ?? ''),
            firstName: String(r['firstName'] ?? ''),
            lastName: String(r['lastName'] ?? ''),
            department: String(r['department'] ?? ''),
            college: String(r['college'] ?? ''),
            yearLevel: String(r['yearLevel'] ?? ''),
          }
          navigate('/edit-info', { state: { userId, initialValues } })
        }}
        serverSide
        totalCount={total}
        page={page}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  )
}

export default TableRecords