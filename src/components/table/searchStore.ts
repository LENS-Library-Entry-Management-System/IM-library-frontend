import * as React from "react"

const defaultSearch = ""

type SearchContextValue = {
  query: string
  setQuery: (q: string) => void
}

const SearchContext = React.createContext<SearchContextValue | undefined>(undefined)

export function useSearch() {
  const ctx = React.useContext(SearchContext)
  if (!ctx) throw new Error("useSearch must be used within SearchProvider")
  return ctx
}

// Safe hook that returns context or undefined when provider is absent.
export function useOptionalSearch() {
  return React.useContext(SearchContext)
}

export { SearchContext, defaultSearch }
