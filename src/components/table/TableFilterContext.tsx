import * as React from "react"

type TableFilterContextValue = {
  selected: Set<string>
  isSelected: (key: string) => boolean
  toggle: (key: string, checked?: boolean) => void
  setSelectedKeys: (keys: string[]) => void
}

const TableFilterContext = React.createContext<TableFilterContextValue | null>(null)

export function TableFilterProvider({
  initialKeys,
  children,
}: {
  initialKeys?: string[]
  children: React.ReactNode
}) {
  const [selected, setSelected] = React.useState<Set<string>>(
    () => new Set(initialKeys ?? [])
  )

  const isSelected = React.useCallback((key: string) => selected.has(key), [selected])

  const toggle = React.useCallback((key: string, checked?: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked === undefined) {
        next.has(key) ? next.delete(key) : next.add(key)
      } else if (checked) next.add(key)
      else next.delete(key)
      return next
    })
  }, [])

  const setSelectedKeys = React.useCallback((keys: string[]) => {
    setSelected(new Set(keys))
  }, [])

  const value = React.useMemo(
    () => ({ selected, isSelected, toggle, setSelectedKeys }),
    [selected, isSelected, toggle, setSelectedKeys]
  )

  return <TableFilterContext.Provider value={value}>{children}</TableFilterContext.Provider>
}

export function useTableFilter() {
  const ctx = React.useContext(TableFilterContext)
  if (!ctx) throw new Error("useTableFilter must be used within TableFilterProvider")
  return ctx
}

export default TableFilterContext
