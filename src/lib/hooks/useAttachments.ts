import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import {
  deleteOrderAttachment,
  getOrderAttachmentUrl,
  uploadOrderAttachment,
} from '@/lib/supabase/storage'
import type { GalleryImage } from '@/types/collection'

export const GALLERY_IMAGES_QUERY_KEY = ['gallery-images'] as const

export function useAttachmentUrl(filePath: string | null | undefined) {
  return useQuery({
    queryKey: ['attachment-url', filePath],
    queryFn: async () => {
      if (!filePath) return null
      if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
        return filePath
      }
      return getOrderAttachmentUrl(filePath)
    },
    enabled: !!filePath,
    staleTime: 1000 * 60 * 30,
  })
}

export function useUploadAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      orderId,
      file,
    }: {
      orderId: string
      file: File
    }) => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('Not authenticated')

      const filePath = await uploadOrderAttachment(orderId, file)

      const { data, error } = await supabase
        .from('attachments')
        .insert({
          order_id: orderId,
          uploaded_by: userData.user.id,
          file_name: file.name,
          file_path: filePath,
          mime_type: file.type || null,
          file_size: file.size,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', data.order_id] })
      queryClient.invalidateQueries({ queryKey: GALLERY_IMAGES_QUERY_KEY })
    },
  })
}

export function useGalleryImages() {
  return useQuery({
    queryKey: GALLERY_IMAGES_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attachments')
        .select('*, order:orders(order_number, client:clients(name))')
        .like('mime_type', 'image/%')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as GalleryImage[]
    },
  })
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      filePath,
      orderId,
    }: {
      id: string
      filePath: string
      orderId: string
    }) => {
      if (!filePath.startsWith('http://') && !filePath.startsWith('https://')) {
        await deleteOrderAttachment(filePath)
      }

      const { error } = await supabase.from('attachments').delete().eq('id', id)
      if (error) throw error
      return orderId
    },
    onSuccess: (orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] })
      queryClient.invalidateQueries({ queryKey: GALLERY_IMAGES_QUERY_KEY })
    },
  })
}
