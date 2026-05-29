import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAddActivity } from '@/lib/hooks/useOrders'
import { useUploadAttachment } from '@/lib/hooks/useAttachments'
import { isImageMimeType } from '@/lib/supabase/storage'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { FileText, Upload } from 'lucide-react'
import { toast } from 'sonner'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]

export default function AttachmentForm() {
  const { id } = useParams()
  const orderId = id as string
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const addActivity = useAddActivity()
  const uploadAttachment = useUploadAttachment()

  const filePreviews = useMemo(
    () =>
      selectedFiles.map((file) => ({
        file,
        previewUrl: isImageMimeType(file.type) ? URL.createObjectURL(file) : null,
      })),
    [selectedFiles]
  )

  useEffect(() => {
    return () => {
      filePreviews.forEach(({ previewUrl }) => {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
      })
    }
  }, [filePreviews])

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name} exceeds 5MB limit`
    }
    if (file.type && !ALLOWED_TYPES.includes(file.type)) {
      return `${file.name} has unsupported file type`
    }
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const errors: string[] = []
    const valid: File[] = []

    for (const file of files) {
      const error = validateFile(file)
      if (error) errors.push(error)
      else valid.push(file)
    }

    if (errors.length) toast.error(errors.join(', '))
    setSelectedFiles(valid)
  }

  const handleUpload = async () => {
    if (!selectedFiles.length || !orderId) return

    try {
      for (const file of selectedFiles) {
        await uploadAttachment.mutateAsync({ orderId, file })
        addActivity.mutate({
          orderId,
          activityType: 'attachment',
          description: `Added attachment: ${file.name}`,
        })
      }
      toast.success(
        selectedFiles.length === 1
          ? 'Attachment uploaded'
          : `${selectedFiles.length} attachments uploaded`
      )
      setSelectedFiles([])
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    }
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Upload Attachment</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="file-upload">Files (images, PDF, docs — max 5MB)</Label>
          <input
            id="file-upload"
            ref={fileInputRef}
            type="file"
            multiple
            accept={ALLOWED_TYPES.join(',')}
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer"
          />
        </div>

        {filePreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filePreviews.map(({ file, previewUrl }) => (
              <div
                key={`${file.name}-${file.size}-${file.lastModified}`}
                className="rounded-lg border overflow-hidden"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 bg-muted p-3">
                    <FileText className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-xs font-medium text-center truncate w-full">
                      {file.name}
                    </span>
                  </div>
                )}
                <p className="px-2 py-1.5 text-xs text-muted-foreground truncate">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!selectedFiles.length || uploadAttachment.isPending}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploadAttachment.isPending ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </Card>
  )
}
