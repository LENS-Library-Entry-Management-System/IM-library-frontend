import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { columns } from "@/features/tableRecords/columns"
import { useTableFilter } from "@/components/table/tableFilterStore"
import { useSort } from "@/components/table/sortStore"
import { LABELS, type SortOption } from "@/components/table/sortConfig"
import { SlidersHorizontal } from "lucide-react"

export default function FilterButton() {
  const { isSelected, toggle } = useTableFilter()
  const { sort, setSort } = useSort()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="
            inline-flex items-center gap-2
            h-9
            border border-[#1D398A]
            bg-white
            px-5 py-2.5
            text-xs font-medium
            text-[#1D398A]
            hover:bg-blue-50
          "
        >
          Filter
          <SlidersHorizontal size={18} strokeWidth={2.2} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        {columns.map((col) => (
          <DropdownMenuCheckboxItem
            key={col.key}
            checked={isSelected(col.key)}
            onCheckedChange={(v) => toggle(col.key, Boolean(v))}
          >
            {col.header}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Sort records</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={sort}
          onValueChange={(v) => setSort(v as SortOption)}
        >
          {(Object.keys(LABELS) as SortOption[]).map((k) => (
            <DropdownMenuRadioItem key={k} value={k}>
              {LABELS[k]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
