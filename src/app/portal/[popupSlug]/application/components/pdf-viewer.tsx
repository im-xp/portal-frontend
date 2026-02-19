import { useCallback } from "react"
import { Download } from "lucide-react"

interface PdfViewerProps {
  filePath: string
}

const PdfViewer = ({ filePath }: PdfViewerProps) => {
  const handleDownload = useCallback(() => {
    const link = document.createElement("a")
    link.href = filePath
    link.download = filePath.split("/").pop() ?? "agreement.pdf"
    link.click()
  }, [filePath])

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-end px-4 py-2 border-b border-border bg-muted/30">
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Download agreement"
          tabIndex={0}
        >
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>

      <object
        data={`${filePath}#toolbar=0`}
        type="application/pdf"
        className="w-full h-[500px]"
        aria-label="Agreement PDF document"
      >
        <div className="flex flex-col items-center justify-center h-[500px] gap-3 text-muted-foreground text-sm">
          <p>Unable to display the PDF in your browser.</p>
          <a
            href={filePath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary/80 transition-colors"
          >
            Click here to view the agreement
          </a>
        </div>
      </object>
    </div>
  )
}

export default PdfViewer
