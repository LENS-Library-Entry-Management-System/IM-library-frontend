import * as React from "react"
import { SortContext, defaultSort } from "@/components/table/sortStore"
import type { SortOption } from "@/components/table/sortConfig"

const SortProvider: React.FC<{ initial?: SortOption; children?: React.ReactNode }> = ({ initial = defaultSort, children }) => {
  const [sort, setSort] = React.useState<SortOption>(initial)
  const value = React.useMemo(() => ({ sort, setSort }), [sort])
  return <SortContext.Provider value={value}>{children}</SortContext.Provider>
}

export default SortProvider
