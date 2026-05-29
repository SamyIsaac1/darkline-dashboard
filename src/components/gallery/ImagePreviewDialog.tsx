import { Link } from 'react-router-dom'
import { useAttachmentUrl } from '@/lib/hooks/useAttachments'
import { formatFileSize } from '@/lib/utils'
import type { GalleryImage } from '@/types/collection'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'

interface ImagePreviewDialogProps {
  image: GalleryImage | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ImagePreviewDialog({
  image,
  open,
  onOpenChange,
}: ImagePreviewDialogProps) {
  const { data: url, isLoading } = useAttachmentUrl(image?.file_path)

  const orderLabel = image?.order?.order_number
  const clientName = image?.order?.client?.name
  const fileSize = formatFileSize(image?.file_size)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="truncate pr-8">{image?.file_name}</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              {orderLabel && image && (
                <Link
                  to={`/orders/${image.order_id}`}
                  className="text-primary hover:underline"
                  onClick={() => onOpenChange(false)}
                >
                  Order {orderLabel}
                </Link>
              )}
              {clientName && <span>{clientName}</span>}
              {fileSize && <span>{fileSize}</span>}
              {image?.created_at && (
                <span>
                  {new Date(image.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center bg-muted min-h-[200px] max-h-[70vh]">
          {isLoading ? (
            <Spinner />
          ) : url ? (
            <img
              src={url}
              alt={image?.file_name}
              className="max-h-[70vh] w-full object-contain"
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
