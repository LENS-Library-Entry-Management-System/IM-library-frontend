import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

export type SortOption =
  | "date_desc"
  | "date_asc"
  | "name_az"
  | "name_za"
  | "time_desc"
  | "time_asc"

const LABELS: Record<SortOption, string> = {
  date_desc: "Date — latest first",
  date_asc: "Date — earliest first",
  name_az: "Name — A → Z",
  name_za: "Name — Z → A",
  time_desc: "Time — latest first",
  time_asc: "Time — earliest first",
}

export default function SortButton({ value, onChange }: { value: SortOption; onChange: (v: SortOption) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          Sort
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort records</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={(v) => onChange(v as SortOption)}>
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
