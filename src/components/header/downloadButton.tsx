import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function DownloadButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="
        inline-flex items-center gap-2 
        rounded-md bg-[#1D398A] 
        px-5 py-2.5 
        text-xs font-medium text-white 
        shadow-sm
        hover:bg-[#17357D]
        h-9
      "
    >
      Download
      <Download size={18} strokeWidth={2.3} />
    </Button>
  )
}
