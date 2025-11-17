import * as React from "react"
import ReusableTable from "@/components/table/reusableTable"
import { rows } from "@/mockData/records"
import { columns } from "./columns"
import { useLayout } from "@/components/layout/useLayout"
import { type SortOption, useSort } from "@/components/table/sortStore"
import { useSearch } from "@/components/table/searchStore"

type Row = {
  id: string
  role: string
  firstName: string
  lastName: string
  department: string
  college: string
  logDate: string
  logTime: string
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

  const filtered = React.useMemo(() => {
    const q = String(query || "").trim().toLowerCase()
    // First filter rows based on the sidebar section selection (Students, Faculties, All)
    const filteredBySection = rows.filter((r) => {
      if (section === "Students") return r.role === "student"
      if (section === "Faculties") return r.role === "faculty"
      return true
    })

    if (!q) return filteredBySection
    return filteredBySection.filter((r) => {
      const fields = [r.id, r.firstName, r.lastName, r.department, r.college, r.logDate, r.logTime]
      return fields.some((f) => String(f ?? "").toLowerCase().includes(q))
    })
  }, [query, section])

  const sorted = React.useMemo(() => sortRows(filtered, sort), [filtered, sort])

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

  return (
    <div>
      <ReusableTable
        data={sorted}
        columns={mappedColumns}
        pageSize={10}
        showSelection
        showActions
        onEdit={(row) => console.log("edit", row)}
      />
    </div>
  )
}

export default TableRecords