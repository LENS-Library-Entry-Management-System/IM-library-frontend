/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

export type SelectedItem = {
  key: string
  // minimal identifiers extracted from a row
  logId?: string
  userId?: string
}

type DeleteHandler = () => Promise<void> | void

type SelectionContextValue = {
  selected: SelectedItem[]
  setSelected: (items: SelectedItem[]) => void
  onDelete?: DeleteHandler
  setOnDelete: React.Dispatch<React.SetStateAction<DeleteHandler | undefined>>
}

export const SelectionContext = React.createContext<SelectionContextValue | null>(null)

export function TableSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = React.useState<SelectedItem[]>([])
  const [onDelete, setOnDelete] = React.useState<DeleteHandler | undefined>(undefined)

  const value = React.useMemo<SelectionContextValue>(() => ({ selected, setSelected, onDelete, setOnDelete }), [selected, onDelete])

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>
}

export function useTableSelection(): SelectionContextValue {
  const ctx = React.useContext(SelectionContext)
  if (!ctx) {
    // return safe no-op defaults when provider is absent
    return {
      selected: [],
      setSelected: () => void 0,
      onDelete: undefined,
      setOnDelete: () => void 0,
    }
  }
  return ctx
}
