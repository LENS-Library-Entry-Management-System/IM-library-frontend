
import { Input } from "@/components/ui/input"
import { useOptionalSearch } from "@/components/table/searchStore"

export default function SearchInput({ value, onChange }: { value?: string; onChange?: (v: string) => void }) {
  // If parent passes props, use them (controlled). Otherwise use shared search if provider exists.
  const shared = useOptionalSearch()

  const current = value ?? shared?.query ?? ""
  const set = (v: string) => {
    if (onChange) onChange(v)
    if (shared) shared.setQuery(v)
  }

  return (
    <div className="flex items-center">
      <Input value={current} onChange={(e) => set(e.target.value)} placeholder="Search" className="w-72" />
    </div>
  )
}
