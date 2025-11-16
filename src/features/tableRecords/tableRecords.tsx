import * as React from "react"
import ReusableTable from "@/components/table/reusableTable"
import { rows } from "@/mockData/records"
import { columns } from "./columns"
import { type SortOption, useSort } from "@/components/table/sortStore"
import { useSearch } from "@/components/table/searchStore"

const sortRows = (rowsData: any[], option: SortOption) => {
  const copy = [...rowsData]
  switch (option) {
    case "date_desc":
      return copy.sort((a, b) => (Date.parse(String(b.logDate)) || 0) - (Date.parse(String(a.logDate)) || 0))
    case "date_asc":
      return copy.sort((a, b) => (Date.parse(String(a.logDate)) || 0) - (Date.parse(String(b.logDate)) || 0))
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

  const filtered = React.useMemo(() => {
    const q = String(query || "").trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => {
      const fields = [r.id, r.firstName, r.lastName, r.department, r.college, r.logDate, r.logTime]
      return fields.some((f) => String(f ?? "").toLowerCase().includes(q))
    })
  }, [rows, query])

  const sorted = React.useMemo(() => sortRows(filtered, sort), [filtered, sort])

  return (
    <div>
      <ReusableTable
        data={sorted}
        columns={columns}
        pageSize={10}
        showSelection
        showActions
        onEdit={(row) => console.log("edit", row)}
      />
    </div>
  )
}

export default TableRecords