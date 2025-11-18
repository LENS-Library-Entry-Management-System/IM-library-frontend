import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function DownloadButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="
        inline-flex items-center gap-2 
        rounded-md bg-primary 
        px-5 py-2.5 
        text-xs font-medium text-white 
        shadow-sm
        hover:bg-primary-foreground
        h-9
      "
    >
      Download
      <Download size={18} strokeWidth={2.3} />
    </Button>
  )
}
