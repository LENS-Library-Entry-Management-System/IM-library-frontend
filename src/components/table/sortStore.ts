import * as React from "react"
import type { SortOption } from "@/components/table/sortConfig"

const defaultSort: SortOption = "date_desc"

type ContextValue = {
  sort: SortOption
  setSort: (s: SortOption) => void
}

const SortContext = React.createContext<ContextValue | undefined>(undefined)

export function useSort() {
  const ctx = React.useContext(SortContext)
  if (!ctx) throw new Error("useSort must be used within SortProvider")
  return ctx
}

export { SortContext, defaultSort }
