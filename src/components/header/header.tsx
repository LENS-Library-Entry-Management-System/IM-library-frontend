import SearchInput from "./searchInput"
import FilterButton from "./filterButton"
import DownloadButton from "./downloadButton"
import DeleteButton from "./deleteButton"
import { useLayout } from "@/components/layout/useLayout"
import { useTableSelection } from "@/components/table/SelectionContext"
import { useExportAllCurrent } from "@/features/tableRecords/exportAllCurrent"

export default function Header() {
  const { section } = useLayout()
  const { selected, onDelete: ctxDelete } = useTableSelection()
  const selectedCount = selected.length
  const onDelete = ctxDelete
  const exportAll = useExportAllCurrent()

  return (
    <header className="flex w-full items-start justify-between rounded-lg border bg-white p-4">
      
      <h1 className="text-3xl font-extrabold uppercase tracking-wide text-primary">
        {section}
      </h1>

      <div className="flex flex-col items-end gap-3">
        
        <div>
          <DownloadButton onClick={exportAll} />
        </div>

        <div className="flex items-center gap-3">
          <SearchInput />
          <FilterButton />
          <DeleteButton
            selectedCount={selectedCount}
            onDelete={onDelete}
            disabled={!selectedCount}
            loading={false}
          />
        </div>

      </div>
    </header>
  )
}
