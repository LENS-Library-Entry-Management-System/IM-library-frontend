import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useOptionalSearch } from "@/components/table/searchStore"
import * as React from "react"

export default function SearchInput({
  value,
  onChange,
}: {
  value?: string
  onChange?: (v: string) => void
}) {
  const shared = useOptionalSearch()

  // Local input state so we can debounce updates to the shared store
  const initial = value ?? shared?.query ?? ""
  const [localValue, setLocalValue] = React.useState<string>(initial)

  // Keep local in sync if external value changes
  React.useEffect(() => {
    setLocalValue(initial)
  }, [initial])

  // Debounce updating the shared store and optional onChange callback
  React.useEffect(() => {
    const handle = setTimeout(() => {
      if (onChange) onChange(localValue)
      if (shared) shared.setQuery(localValue)
    }, 1000) // 1 second debounce

    return () => clearTimeout(handle)
  }, [localValue, onChange, shared])

  return (
    <div className="relative">
      {/* Search Icon */}
      <Search
        size={18}
        strokeWidth={2}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
      />

      {/* Input */}
      <Input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Search"
        className="
          w-64 pl-10 pr-4 py-2.5
          rounded-lg
          border border-gray-300
          text-sm
          placeholder:text-gray-400
          focus-visible:ring-primary
          focus-visible:border-primary
        "
      />
    </div>
  )
}
