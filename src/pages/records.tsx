import * as React from "react"
import TableRecords from "@/features/tableRecords/tableRecords"
import { columns } from "@/features/tableRecords/columns"
import { TableFilterProvider } from "@/components/table/TableFilterContext"
import SortProvider from "@/components/table/SortContext"
import SearchProvider from "@/components/table/SearchContext"
import { LayoutProvider } from "@/components/layout/LayoutContext"
import Sidebar from "@/components/sidebar/sidebar"
import Header from "@/components/header/header"

const Records: React.FC = () => {
  return (
    <LayoutProvider>
      <div className="flex h-screen w-full bg-app">
        <Sidebar />
        <main className="flex-1 flex flex-col p-8">
          <div className="w-full max-w-5xl mx-auto">
            <TableFilterProvider initialKeys={columns.map((c) => c.key)}>
              <SortProvider>
                <SearchProvider>
                  <Header />
                  <div className="mt-6 w-full">
                    <TableRecords />
                  </div>
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