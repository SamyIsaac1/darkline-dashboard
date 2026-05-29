import { useAttachmentUrl, useDeleteAttachment } from '@/lib/hooks/useAttachments'
import { useDeleteConfirm } from '@/lib/hooks/useDeleteConfirm'
import { useAddActivity } from '@/lib/hooks/useOrders'
import { isImageMimeType } from '@/lib/supabase/storage'
import type { Attachment } from '@/types/collection'
import { Button } from '@/components/ui/button'
import { FileText, Trash2 } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

interface AttachmentItemProps {
  attachment: Attachment
  orderId: string
}

export default function AttachmentItem({ attachment, orderId }: AttachmentItemProps) {
  const { data: url, isLoading } = useAttachmentUrl(attachment.file_path)
  const deleteAttachment = useDeleteAttachment()
  const addActivity = useAddActivity()
  const { confirmDelete } = useDeleteConfirm()

  const handleDelete = () => {
    confirmDelete({
      itemName: attachment.file_name,
      onConfirm: async () => {
        await deleteAttachment.mutateAsync({
          id: attachment.id,
          filePath: attachment.file_path,
          orderId,
        })

        addActivity.mutate({
          orderId,
          activityType: 'attachment',
          description: `Removed attachment: ${attachment.file_name}`,
        })
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 rounded-lg border bg-muted">
        <Spinner />
      </div>
    )
  }

  if (!url) return null

  const isImage = isImageMimeType(attachment.mime_type)

  return (
    <div className="relative group">
      {isImage ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img
            src={url}
            alt={attachment.file_name}
            className="w-full h-48 object-cover rounded-lg border hover:opacity-80 transition"
          />
        </a>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center h-48 rounded-lg border bg-muted hover:bg-accent transition p-4"
        >
          <FileText className="w-10 h-10 text-muted-foreground mb-2" />
          <span className="text-sm font-medium text-center truncate w-full">
            {attachment.file_name}
          </span>
        </a>
      )}
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleDelete}
        disabled={deleteAttachment.isPending}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
