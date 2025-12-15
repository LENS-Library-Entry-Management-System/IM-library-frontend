
import * as React from "react"

export type SectionKey = "All" | "Students" | "Faculties" | "Status"

type LayoutContextType = {
  section: SectionKey
  setSection: (s: SectionKey) => void
}

const LayoutContext = React.createContext<LayoutContextType | undefined>(undefined)

export const LayoutProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [section, setSection] = React.useState<SectionKey>("Students")

  return (
    <LayoutContext.Provider value={{ section, setSection }}>
      {children}
    </LayoutContext.Provider>
  )
}

export default LayoutContext
