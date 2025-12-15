import * as React from "react"
import TableRecords from "@/features/tableRecords/tableRecords"
import { columns } from "@/features/tableRecords/columns"
import { TableFilterProvider } from "@/components/table/TableFilterContext"
import SortProvider from "@/components/table/SortContext"
import SearchProvider from "@/components/table/SearchContext"
import { LayoutProvider } from "@/components/layout/LayoutContext"
import Sidebar from "@/components/sidebar/sidebar"
import Header from "@/components/header/header"
import { TableSelectionProvider } from "@/components/table/SelectionContext"

const Records: React.FC = () => {
  return (
    <LayoutProvider>
      <div className="flex h-screen w-full bg-[#F7F7FF] overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-y-auto px-5 md:py-3 lg:py-5">
          <div className="w-full max-w-[1500px] mx-auto">

            <TableFilterProvider initialKeys={columns.map((c) => c.key)}>
              <SortProvider>
                <SearchProvider>

                  <TableSelectionProvider>
                    <Header />
                    <div className="mt-5">
                      <TableRecords />
                    </div>
                  </TableSelectionProvider>

                </SearchProvider>
              </SortProvider>
            </TableFilterProvider>

          </div>
        </main>
      </div>
    </LayoutProvider>
  )
}

export default Records
