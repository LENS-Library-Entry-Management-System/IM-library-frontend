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
    <Button variant="destructive" size="sm" onClick={handleClick} className="ml-2">
      <Trash2Icon className="h-4 w-4" />
    </Button>
  )
}