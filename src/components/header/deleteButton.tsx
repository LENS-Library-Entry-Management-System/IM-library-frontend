import { Button } from "@/components/ui/button"
import { Trash2Icon } from "lucide-react"

export default function DeleteButton({
  onDelete,
  confirmMessage = "Are you sure you want to delete the selected items?",
}: {
  onDelete?: () => void
  confirmMessage?: string
}) {
  const handleClick = () => {
    if (!onDelete) return
    const ok = window.confirm(confirmMessage)
    if (ok) onDelete()
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className="
        rounded-md
        h-9
        border border-gray-300
        bg-white
        p-2.5
        text-gray-500
        hover:bg-gray-100
      "
    >
      <Trash2Icon className="h-5 w-5" strokeWidth={2} />
    </Button>
  )
}
