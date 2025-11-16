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
import { useTableFilter } from "@/components/table/TableFilterContext"

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
}

const ReusableTable2: React.FC<ReusableTableProps> = ({
  data = sampleRows,
  columns,
  pageSize = defaultPageSize,
  showSelection = false,
  showActions = false,
  onEdit,
}) => {
  const [selected, setSelected] = React.useState<Record<string, boolean>>({})
  const [page, setPage] = React.useState(1)

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [totalPages, page])

  const start = (page - 1) * pageSize
  const pageRows = data.slice(start, start + pageSize)

  function toggleRow(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }))
  }

  const allSelected = pageRows.length > 0 && pageRows.every((r) => selected[String(r.id)])
  function toggleAll() {
    if (allSelected) {
      setSelected((s) => {
        const copy = { ...s }
        pageRows.forEach((r) => delete copy[String(r.id)])
        return copy
      })
    } else {
      setSelected((s) => {
        const copy = { ...s }
        pageRows.forEach((r) => (copy[String(r.id)] = true))
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
  const defaultIsSelected = React.useCallback((k: string): boolean => (void k, true), [])
  let isSelected = defaultIsSelected
  try {
    const ctx = useTableFilter()
    isSelected = ctx.isSelected
  } catch {
    // no provider available — keep default
  }

  const visibleColumns = React.useMemo(() => effectiveColumns.filter((c) => isSelected(c.key)), [effectiveColumns, isSelected])

  const pages = getVisiblePages(totalPages, page)

  return (
    <div className="w-full">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {showSelection ? (
                <TableHead className="w-12">
                  <input aria-label="Select all" type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded border-gray-300 text-primary" />
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
            {pageRows.map((row) => (
              <TableRow key={String(row.id)} data-state={selected[String(row.id)] ? "selected" : ""}>
                {showSelection ? (
                  <TableCell className="w-12">
                    <input aria-label={`Select ${row.id}`} type="checkbox" checked={!!selected[String(row.id)]} onChange={() => toggleRow(String(row.id))} className="h-4 w-4 rounded border-gray-300 text-primary" />
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
            ))}
          </TableBody>

          <TableCaption>
            Showing {start + 1} - {Math.min(start + pageRows.length, data.length)} of {data.length} records
          </TableCaption>
        </Table>

        <div className="mt-4 flex items-center justify-center">
          <Pagination aria-label="Table pagination">
            <PaginationContent>
              <PaginationPrevious href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)) }} />
              {pages.map((p, i) => p === "..." ? (
                <PaginationItem key={`e-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink href="#" isActive={p === page} onClick={(e: React.MouseEvent) => { e.preventDefault(); setPage(Number(p)) }}>{String(p).padStart(2, "0")}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext href="#" onClick={(e: React.MouseEvent) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)) }} />
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

export default ReusableTable2
