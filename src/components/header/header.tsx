import SearchInput from "./searchInput"
import FilterButton from "./filterButton"
import DownloadButton from "./downloadButton"
import DeleteButton from "./deleteButton"
import { useLayout } from "@/components/layout/useLayout"

export default function Header() {
  const { section } = useLayout()

  return (
    <header className=" flex w-full items-center justify-between gap-4 rounded border bg-muted/50 p-4">
      <div>
        <h1 className="text-2xl font-bold uppercase">{section}</h1>
      </div>

      <div className="flex items-center">
        <SearchInput />
        <FilterButton />
        <DownloadButton />
        <DeleteButton />
      </div>
    </header>
  )
}
