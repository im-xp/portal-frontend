'use client'

import { useState, useRef } from 'react'
import { Upload, Loader2, X, ImageIcon } from 'lucide-react'
import { LabelRequired } from './label'
import uploadFileToS3 from '@/helpers/upload'

interface ImageUploadFieldProps {
  label: string
  value: string
  onChange: (url: string) => void
  placeholder?: string
  isRequired?: boolean
  subtitle?: string
  error?: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024

const ImageUploadField = ({ label, value, onChange, placeholder, isRequired, subtitle, error }: ImageUploadFieldProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      alert('The file is too large. Please select an image less than 5MB')
      return
    }

    try {
      setIsUploading(true)
      const imageUrl = await uploadFileToS3(file)
      onChange(imageUrl)
    } catch {
      alert('There was an error uploading the image. Please try again.')
    } finally {
      setIsUploading(false)
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
  }

  return (
    <div className="space-y-2">
      <LabelRequired className="text-sm font-medium text-foreground" isRequired={isRequired}>{label}</LabelRequired>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      <div
        className="relative w-32 h-32 rounded-lg border-2 border-dashed border-border cursor-pointer overflow-hidden transition-all duration-200 hover:border-primary/50"
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {isHovering && !isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Upload className="w-6 h-6 text-white" />
              </div>
            )}
            {!isUploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon className="w-8 h-8" />
            <span className="text-xs text-center px-2">{placeholder || 'Upload image'}</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  )
}

export default ImageUploadField
