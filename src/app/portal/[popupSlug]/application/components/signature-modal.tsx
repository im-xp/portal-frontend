"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Pencil, Type, Upload, X } from "lucide-react"

type SignatureTab = "draw" | "type" | "upload"

interface SignatureModalProps {
  open: boolean
  onClose: () => void
  onSave: (signatureDataUrl: string) => void
}

const TABS: { id: SignatureTab; label: string; icon: React.ReactNode }[] = [
  { id: "draw", label: "Draw", icon: <Pencil className="h-4 w-4" /> },
  { id: "type", label: "Type", icon: <Type className="h-4 w-4" /> },
  { id: "upload", label: "Upload", icon: <Upload className="h-4 w-4" /> },
]

export const SignatureModal = ({ open, onClose, onSave }: SignatureModalProps) => {
  const [activeTab, setActiveTab] = useState<SignatureTab>("draw")
  const [typedSignature, setTypedSignature] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setActiveTab("draw")
    setTypedSignature("")
    setUploadedImage(null)
  }, [open])

  useEffect(() => {
    if (!open || activeTab !== "draw") return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "#1a1a2e"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [open, activeTab])

  const getCanvasPoint = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }, [])

  const handleDrawStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const point = getCanvasPoint(e)
    if (!point) return
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    isDrawingRef.current = true
    ctx.beginPath()
    ctx.moveTo(point.x, point.y)
  }, [getCanvasPoint])

  const handleDrawMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawingRef.current) return
    const point = getCanvasPoint(e)
    if (!point) return
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
  }, [getCanvasPoint])

  const handleDrawEnd = useCallback(() => {
    isDrawingRef.current = false
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDone = useCallback(() => {
    if (activeTab === "draw") {
      const canvas = canvasRef.current
      if (!canvas) return
      onSave(canvas.toDataURL("image/png"))
    }

    if (activeTab === "type") {
      if (!typedSignature.trim()) return
      const canvas = document.createElement("canvas")
      canvas.width = 400
      canvas.height = 150
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = "italic 48px 'Georgia', serif"
      ctx.fillStyle = "#1a1a2e"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(typedSignature, canvas.width / 2, canvas.height / 2)
      onSave(canvas.toDataURL("image/png"))
    }

    if (activeTab === "upload") {
      if (!uploadedImage) return
      onSave(uploadedImage)
    }

    onClose()
  }, [activeTab, typedSignature, uploadedImage, onSave, onClose])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        hasCloseButton={false}
        className="bg-card text-card-foreground border-border rounded-lg p-0 max-w-2xl overflow-hidden"
      >
        <div className="flex min-h-[320px]">
          <div className="flex flex-col border-r border-border bg-muted/30 w-[100px] shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 px-3 py-4 text-xs font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                aria-label={tab.label}
                tabIndex={0}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col flex-1">
            <DialogHeader className="flex flex-row items-center justify-between p-4 pb-2 space-y-0">
              <DialogTitle className="text-base font-medium">
                Please provide your signature below
              </DialogTitle>
              <button
                type="button"
                onClick={onClose}
                className="rounded-sm text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Close"
                tabIndex={0}
              >
                <X className="h-4 w-4" />
              </button>
            </DialogHeader>

            <div className="flex-1 p-4 pt-2">
              {activeTab === "draw" && (
                <canvas
                  ref={canvasRef}
                  className="w-full h-[200px] border border-border rounded-md cursor-crosshair bg-white"
                  onMouseDown={handleDrawStart}
                  onMouseMove={handleDrawMove}
                  onMouseUp={handleDrawEnd}
                  onMouseLeave={handleDrawEnd}
                  onTouchStart={handleDrawStart}
                  onTouchMove={handleDrawMove}
                  onTouchEnd={handleDrawEnd}
                />
              )}

              {activeTab === "type" && (
                <div className="flex flex-col gap-4">
                  <Input
                    value={typedSignature}
                    onChange={(e) => setTypedSignature(e.target.value)}
                    placeholder="Type your full name"
                    className="text-lg"
                    aria-label="Type your signature"
                  />
                  {typedSignature && (
                    <div className="flex items-center justify-center h-[140px] border border-border rounded-md bg-white">
                      <span className="text-4xl italic text-[#1a1a2e]" style={{ fontFamily: "'Georgia', serif" }}>
                        {typedSignature}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "upload" && (
                <div className="flex flex-col gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                    aria-label="Upload signature image"
                  />
                  {uploadedImage ? (
                    <div className="flex items-center justify-center h-[200px] border border-border rounded-md bg-white p-4">
                      <img src={uploadedImage} alt="Uploaded signature" className="max-h-full max-w-full object-contain" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center gap-2 h-[200px] border-2 border-dashed border-border rounded-md text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
                      aria-label="Click to upload signature"
                      tabIndex={0}
                    >
                      <Upload className="h-8 w-8" />
                      <span className="text-sm">Click to upload an image</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end p-4 pt-0">
              <Button type="button" onClick={handleDone}>
                Done
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
