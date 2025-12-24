import * as React from "react"
import SearchInput from "./searchInput"
import FilterButton from "./filterButton"
import DownloadButton from "./downloadButton"
import ExportDialog from "./exportDialog"
import DeleteButton from "./deleteButton"
import { useLayout } from "@/components/layout/useLayout"
import { useTableSelection } from "@/components/table/SelectionContext"
// import { useExportAllCurrent } from "@/features/tableRecords/exportAllCurrent"
import { Button } from "@/components/ui/button"
import ManualAddDialog from "@/features/formUses/ManualAddDialog"

export default function Header() {
  const { section } = useLayout()
  const { selected, onDelete: ctxDelete } = useTableSelection()
  const selectedCount = selected.length
  const onDelete = ctxDelete
  // const exportAll = useExportAllCurrent()
  const [exportOpen, setExportOpen] = React.useState(false)
  const [manualOpen, setManualOpen] = React.useState(false)

  const derivedUserType = section === 'Students' ? 'student' : section === 'Faculties' ? 'faculty' : 'all'
  const redactedOnly = section === 'Redacted'

  return (
    <header className="flex w-full items-start justify-between rounded-lg border bg-white p-4">
      
      <h1 className="text-3xl font-extrabold uppercase tracking-wide text-primary">
        {section}
      </h1>

      <div className="flex flex-col items-end gap-3">
        
        <div>
          <DownloadButton onClick={() => setExportOpen(true)} />
          <ExportDialog open={exportOpen} onOpenChange={setExportOpen} userType={derivedUserType} redactedOnly={redactedOnly} />
          <ManualAddDialog open={manualOpen} onOpenChange={setManualOpen} />
        </div>

        <div className="flex items-center gap-3">
          <SearchInput />
          <FilterButton />
          {section !== 'Redacted' && (
            <>
              <Button
                onClick={() => setManualOpen(true)}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary-foreground h-9"
              >
                Manual Add
              </Button>
              <DeleteButton
                selectedCount={selectedCount}
                onDelete={onDelete}
                disabled={!selectedCount}
                loading={false}
              />
            </>
          )}
        </div>

      </div>
    </header>
  )
}
