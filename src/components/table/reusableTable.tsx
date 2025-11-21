import * as React from "react"
import { PencilIcon } from "lucide-react"

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { useTableFilter } from "@/components/table/tableFilterStore"

type CellValue = React.ReactNode | string | number | null | undefined

type Row = {
  id: string
} & Record<string, CellValue>

type Column = {
  key: string
  header?: React.ReactNode
  className?: string
  render?: (row: Row) => React.ReactNode
}

const defaultPageSize = 10

function getVisiblePages(total: number, current: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | "...")[] = []
  const left = Math.max(2, current - 1)
  const right = Math.min(total - 1, current + 1)

  pages.push(1)
  if (left > 2) pages.push("...")

  for (let i = left; i <= right; i++) pages.push(i)

  if (right < total - 1) pages.push("...")
  pages.push(total)
  return pages
}

const sampleRows: Row[] = []

type ReusableTableProps = {
  data?: Row[]
  columns?: Column[]
  pageSize?: number
  showSelection?: boolean
  showActions?: boolean
  onEdit?: (row: Row) => void
  // Server-side pagination support
  serverSide?: boolean
  totalCount?: number
  page?: number
  onPageChange?: (page: number) => void
}

const ReusableTable2: React.FC<ReusableTableProps> = ({
  data = sampleRows,
  columns,
  pageSize = defaultPageSize,
  showSelection = false,
  showActions = false,
  onEdit,
  serverSide = false,
  totalCount,
  page,
  onPageChange,
}) => {
  const [selected, setSelected] = React.useState<Record<string, boolean>>({})
  const [localPage, setLocalPage] = React.useState(1)

  // Helper to compute a stable, unique key for a row.
  // Prefer backend logId (unique entry id). If missing, combine user id + timestamp.
  const getRowKey = React.useCallback((row: Row, idx: number) => {
    // Row is indexable; read known possible fields and coerce safely without using `any`.
    const logIdRaw = row["logId"] ?? row["log_id"] ?? null
    const logId = typeof logIdRaw === "string" ? logIdRaw : typeof logIdRaw === "number" ? String(logIdRaw) : null
    if (logId && logId.trim() !== "") return logId

    const userIdRaw = row["userId"] ?? row["user_id"] ?? null
    const userId = typeof userIdRaw === "string" ? userIdRaw : typeof userIdRaw === "number" ? String(userIdRaw) : null

    const tsRaw = row["logTimestamp"] ?? row["log_timestamp"] ?? row["createdAt"] ?? idx
    const ts = typeof tsRaw === "number" ? tsRaw : typeof tsRaw === "string" ? Number(tsRaw) || idx : idx

    if (userId && userId.trim() !== "") return `${userId}-${ts}`

    const idRaw = row["id"] ?? idx
    const idStr = typeof idRaw === "string" ? idRaw : String(idRaw)
    return `${idStr}-${ts}`
  }, [])

  const currentPage = serverSide ? (page ?? localPage) : localPage

  const totalPages = serverSide && totalCount !== undefined ? Math.max(1, Math.ceil(totalCount / pageSize)) : Math.max(1, Math.ceil(data.length / pageSize))

  React.useEffect(() => {
    if (!serverSide && localPage > totalPages) setLocalPage(totalPages)
    if (serverSide && page && page > totalPages && onPageChange) onPageChange(totalPages)
  }, [totalPages, localPage, serverSide, page, onPageChange])

  const start = (currentPage - 1) * pageSize
  const pageRows = serverSide ? data : data.slice(start, start + pageSize)

  function toggleRow(key: string) {
    setSelected((s) => ({ ...s, [key]: !s[key] }))
  }

  const pageRowKeys = pageRows.map((r, i) => getRowKey(r, i))
  const allSelected = pageRowKeys.length > 0 && pageRowKeys.every((k) => selected[String(k)])
  function toggleAll() {
    if (allSelected) {
      setSelected((s) => {
        const copy = { ...s }
        pageRowKeys.forEach((k) => delete copy[String(k)])
        return copy
      })
    } else {
      setSelected((s) => {
        const copy = { ...s }
        pageRowKeys.forEach((k) => (copy[String(k)] = true))
        return copy
      })
    }
  }

  const effectiveColumns: Column[] = React.useMemo(() => {
    if (columns && columns.length) return columns

    if (!data || data.length === 0) return []

    const keys = Object.keys(data[0]).filter((k) => k !== "id")
    return keys.map((k) => ({ key: k, header: k }))
  }, [columns, data])

  // Consume filter context. Create a stable default callback and override if a provider is present.
  const defaultIsSelected: (k: string) => boolean = React.useCallback((k: string): boolean => {
    void k
    return true
  }, [])
  let isSelected = defaultIsSelected
  try {
    const ctx = useTableFilter()
    isSelected = ctx.isSelected
  } catch {
    // no provider available — keep default
  }

  const visibleColumns = React.useMemo(() => effectiveColumns.filter((c) => isSelected(c.key)), [effectiveColumns, isSelected])

  const pages = getVisiblePages(totalPages, currentPage)

  const totalDisplay = serverSide && typeof totalCount === 'number' ? totalCount : data.length
  const endCount = Math.min(start + pageRows.length, totalDisplay)

  return (
    <div className="w-full">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {showSelection ? (
                <TableHead className="w-12">
                  <input aria-label="Select all" type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded border-gray-300 text-primary accent-[#1D398A]" />
                </TableHead>
              ) : null}

              {visibleColumns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.header}
                </TableHead>
              ))}

              {showActions ? <TableHead className="w-12" /> : null}
            </TableRow>
          </TableHeader>

          <TableBody>
            {pageRows.map((row, i) => {
              const rowKey = getRowKey(row, i)
              return (
                <TableRow key={String(rowKey)} data-state={selected[String(rowKey)] ? "selected" : ""}>
                  {showSelection ? (
                    <TableCell className="w-12">
                      <input aria-label={`Select ${String(row.id)}`} type="checkbox" checked={!!selected[String(rowKey)]} onChange={() => toggleRow(String(rowKey))} className="h-4 w-4 rounded border-gray-300 text-primary accent-[#1D398A]" />
                    </TableCell>
                  ) : null}

                  {visibleColumns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render ? col.render(row) : (row[col.key] as React.ReactNode)}
                    </TableCell>
                  ))}

                  {showActions ? (
                    <TableCell className="w-12 text-right">
                      <Button variant="ghost" size="icon" aria-label="Edit row" onClick={() => onEdit && onEdit(row)}>
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  ) : null}
                </TableRow>
              )
            })}
          </TableBody>

          <TableCaption>
            Showing {start + 1} - {endCount} of {totalDisplay} records
          </TableCaption>
        </Table>

        <div className="mt-4 flex items-center justify-center">
          <Pagination aria-label="Table pagination">
            <PaginationContent>
              <PaginationPrevious href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); const next = Math.max(1, currentPage - 1); if (serverSide && onPageChange) onPageChange(next); else setLocalPage(next); }} />
              {pages.map((p, i) => p === "..." ? (
                <PaginationItem key={`e-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink href="#" isActive={p === currentPage} onClick={(e: React.MouseEvent) => { e.preventDefault(); if (serverSide && onPageChange) onPageChange(Number(p)); else setLocalPage(Number(p)); }}>{String(p).padStart(2, "0")}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); const next = Math.min(totalPages, currentPage + 1); if (serverSide && onPageChange) onPageChange(next); else setLocalPage(next); }} />
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

export default ReusableTable2
