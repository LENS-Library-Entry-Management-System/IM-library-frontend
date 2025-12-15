import { Button } from "@/components/ui/button"
import { Trash2Icon } from "lucide-react"

type Props = {
  onDelete?: () => void | Promise<void>
  confirmMessage?: string
  selectedCount?: number
  disabled?: boolean
  loading?: boolean
}

export default function DeleteButton({
  onDelete,
  confirmMessage = "Are you sure you want to delete the selected items?",
  selectedCount,
  disabled,
  loading,
}: Props) {
  const handleClick = async () => {
    if (!onDelete) return

    const msg =
      selectedCount && selectedCount > 0
        ? `${confirmMessage} (${selectedCount} selected)`
        : confirmMessage

    const ok = window.confirm(msg)
    if (!ok) return

    try {
      const maybePromise = onDelete()
      if (maybePromise && typeof (maybePromise as Promise<void>).then === "function") {
        await maybePromise
      }
    } catch (err) {
      // keep feedback minimal in UI; follow project logging norm
      console.error("Delete action failed:", err)
      alert("Delete failed. Please try again.")
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-label={"Delete selected"}
      title={selectedCount && selectedCount > 0 ? `Delete ${selectedCount} selected` : "Delete"}
      className="
        rounded-md
        h-9
        border border-gray-300
        bg-white
        p-2.5
        text-gray-500
        hover:bg-gray-100
        disabled:opacity-60
        disabled:cursor-not-allowed
      "
    >
      <Trash2Icon className="h-5 w-5" strokeWidth={2} />
      {loading ? (
        <span className="ml-2 text-xs">Deleting…</span>
      ) : selectedCount && selectedCount > 0 ? (
        <span className="ml-2 text-xs">{selectedCount}</span>
      ) : null}
    </Button>
  )
}
