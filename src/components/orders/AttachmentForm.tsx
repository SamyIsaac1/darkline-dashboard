import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAddActivity } from '@/lib/hooks/useOrders'
import { useUploadAttachment } from '@/lib/hooks/useAttachments'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'

const MAX_FILE_SIZE = 10 * 1024 * 1024
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

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name} exceeds 10MB limit`
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
          <Label htmlFor="file-upload">Files (images, PDF, docs — max 10MB)</Label>
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

        {selectedFiles.length > 0 && (
          <ul className="text-sm text-muted-foreground space-y-1">
            {selectedFiles.map((f) => (
              <li key={f.name}>{f.name} ({(f.size / 1024).toFixed(1)} KB)</li>
            ))}
          </ul>
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
