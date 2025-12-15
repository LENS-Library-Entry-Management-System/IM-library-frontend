import * as React from "react"

export type TableFilterContextValue = {
  selected: Set<string>
  isSelected: (key: string) => boolean
  toggle: (key: string, checked?: boolean) => void
  setSelectedKeys: (keys: string[]) => void
}

const TableFilterContext = React.createContext<TableFilterContextValue | null>(null)

export function useTableFilter() {
  const ctx = React.useContext(TableFilterContext)
  if (!ctx) throw new Error("useTableFilter must be used within TableFilterProvider")
  return ctx
}

export { TableFilterContext }
