import { useLayout } from "@/components/layout/useLayout"
import type { SectionKey } from "@/components/layout/LayoutContext"

const items: { key: SectionKey; label: string }[] = [
	{ key: "All", label: "All" },
	{ key: "Students", label: "Students" },
	{ key: "Faculties", label: "Faculties" },
	{ key: "Status", label: "Status" },
]

export default function Sidebar() {
	const { section, setSection } = useLayout()

	return (
		<aside className="w-56 border-r bg-white p-4">
			<div className="mb-6">
				<div className="text-xl font-bold text-primary">LENS</div>
			</div>

			<nav className="flex flex-col gap-2">
				{items.map((it) => (
					<button
						key={it.key}
						onClick={() => setSection(it.key)}
						className={`flex items-center gap-2 rounded px-3 py-2 text-left text-sm ${
							section === it.key ? "bg-muted/50 font-medium" : ""
						}`}
					>
						{it.label}
					</button>
				))}
			</nav>
		</aside>
	)
}
