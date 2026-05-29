import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import {
  deleteOrderAttachment,
  getOrderAttachmentUrl,
  uploadOrderAttachment,
} from '@/lib/supabase/storage'

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
    },
  })
}
