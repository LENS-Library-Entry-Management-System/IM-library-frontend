
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
import { useTableFilter } from "@/components/table/TableFilterContext"
import { useSort } from "@/components/table/sortStore"
import { LABELS, type SortOption } from "@/components/table/sortConfig"

export default function FilterButton() {
  const { isSelected, toggle } = useTableFilter()
  const { sort, setSort } = useSort()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          Filter
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
        <DropdownMenuRadioGroup value={sort} onValueChange={(v) => setSort(v as SortOption)}>
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
