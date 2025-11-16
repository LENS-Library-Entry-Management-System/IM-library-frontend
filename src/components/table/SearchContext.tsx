import * as React from "react"
import { SearchContext, defaultSearch } from "./searchStore"

const SearchProvider: React.FC<{ initial?: string; children?: React.ReactNode }> = ({ initial = defaultSearch, children }) => {
  const [query, setQuery] = React.useState(initial)
  const value = React.useMemo(() => ({ query, setQuery }), [query])
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export default SearchProvider
