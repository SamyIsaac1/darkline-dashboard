import { useAttachmentUrl, useDeleteAttachment } from '@/lib/hooks/useAttachments'
import { useDeleteConfirm } from '@/lib/hooks/useDeleteConfirm'
import { useAddActivity } from '@/lib/hooks/useOrders'
import type { GalleryImage } from '@/types/collection'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Trash2 } from 'lucide-react'

interface GalleryImageCardProps {
  image: GalleryImage
  onPreview: (image: GalleryImage) => void
  onDeleted?: (image: GalleryImage) => void
}

export default function GalleryImageCard({
  image,
  onPreview,
  onDeleted,
}: GalleryImageCardProps) {
  const { data: url, isLoading } = useAttachmentUrl(image.file_path)
  const deleteAttachment = useDeleteAttachment()
  const addActivity = useAddActivity()
  const { confirmDelete } = useDeleteConfirm()

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()

    confirmDelete({
      itemName: image.file_name,
      onConfirm: async () => {
        await deleteAttachment.mutateAsync({
          id: image.id,
          filePath: image.file_path,
          orderId: image.order_id,
        })

        addActivity.mutate({
          orderId: image.order_id,
          activityType: 'attachment',
          description: `Removed attachment: ${image.file_name}`,
        })

        onDeleted?.(image)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center aspect-square rounded-lg border bg-muted">
        <Spinner />
      </div>
    )
  }

  if (!url) return null

  return (
    <div
      className="relative group cursor-pointer"
      onClick={() => onPreview(image)}
    >
      <img
        src={url}
        alt={image.file_name}
        className="w-full aspect-square object-cover rounded-lg border hover:opacity-80 transition"
      />
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
