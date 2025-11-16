import { useLayout } from "@/components/layout/useLayout"
import type { SectionKey } from "@/components/layout/LayoutContext"

import logo from "@/assets/logo.svg"
import intersect from "@/assets/intersect.svg"

import { LayoutDashboard, Users, Building2, HelpCircle } from "lucide-react"
import type { JSX } from "react"

type ItemType = { key: SectionKey; label: string; icon: JSX.Element }

const items: ItemType[] = [
  { key: "All", label: "All", icon: <LayoutDashboard size={18} /> },
  { key: "Students", label: "Students", icon: <Users size={18} /> },
  { key: "Faculties", label: "Faculties", icon: <Building2 size={18} /> },
  { key: "Status", label: "Status", icon: <HelpCircle size={18} /> },
]

export default function Sidebar() {
  const { section, setSection } = useLayout()

  return (
    <aside
      className="
        relative
        w-64
        h-screen
        border-r
        bg-white
        px-6
        py-15
        flex
        flex-col
      "
    >
      {/* Logo */}
      <div className="mb-16 flex items-center justify-center">
        <img
          src={logo}
          alt="LENS Logo"
          className="w-40 select-none"
        />
      </div>

      {/* Buttons */}
      <nav className="flex flex-col gap-2">
        {items.map((item) => {
          const isActive = section === item.key
          return (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={`
                flex items-center gap-3 px-4 py-2 rounded-lg text-sm
                transition
                ${isActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700"}
              `}
            >
              <span className={`${isActive ? "text-blue-600" : "text-gray-500"}`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Background decoration */}
      <img
        src={intersect}
        alt="background decoration"
        className="absolute bottom-0 left-0 w-full opacity-40 pointer-events-none select-none"
      />
    </aside>
  )
}
