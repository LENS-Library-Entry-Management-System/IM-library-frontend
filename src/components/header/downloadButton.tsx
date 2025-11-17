
import { Button } from "@/components/ui/button"

export default function DownloadButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button
      variant="default"
      size="sm"
      onClick={onClick}
      className="ml-2 inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm text-white"
    >
    Download
    </Button>
  )
}
