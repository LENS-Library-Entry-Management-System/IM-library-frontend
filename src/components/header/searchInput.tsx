import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useOptionalSearch } from "@/components/table/searchStore"

export default function SearchInput({
  value,
  onChange,
}: {
  value?: string
  onChange?: (v: string) => void
}) {
  const shared = useOptionalSearch()

  const current = value ?? shared?.query ?? ""
  const set = (v: string) => {
    if (onChange) onChange(v)
    if (shared) shared.setQuery(v)
  }

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
        value={current}
        onChange={(e) => set(e.target.value)}
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
