import { useState } from 'react'
import { useGalleryImages } from '@/lib/hooks/useAttachments'
import type { GalleryImage } from '@/types/collection'
import { Spinner } from '@/components/ui/spinner'
import GalleryImageCard from './GalleryImageCard'
import ImagePreviewDialog from './ImagePreviewDialog'

export default function GalleryContent() {
  const { data: images, isLoading } = useGalleryImages()
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    )
  }

  const galleryImages = images ?? []

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Gallery</h1>

      {galleryImages.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No images yet</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {galleryImages.map((image) => (
            <GalleryImageCard
              key={image.id}
              image={image}
              onPreview={setPreviewImage}
              onDeleted={(deleted) => {
                if (previewImage?.id === deleted.id) {
                  setPreviewImage(null)
                }
              }}
            />
          ))}
        </div>
      )}

      <ImagePreviewDialog
        image={previewImage}
        open={!!previewImage}
        onOpenChange={(open) => {
          if (!open) setPreviewImage(null)
        }}
      />
    </div>
  )
}
