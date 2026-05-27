import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { TablesInsert } from '@/types/supabase'
import { useParams } from 'react-router-dom'

type AttachmentInsert = TablesInsert<'attachments'>

export function useAddAttachment() {
    const queryClient = useQueryClient()
    const { id } = useParams()

    return useMutation({
        mutationFn: async ({
            file_name,
            file_path,
        }: Partial<AttachmentInsert>) => {
            const { data: userData } = await supabase.auth.getUser()
            if (!userData.user) throw new Error('Not authenticated')
            const { data, error } = await supabase
                .from('attachments')
                .insert({
                    order_id: id,
                    uploaded_by: userData.user.id,
                    file_name: file_name,
                    file_path: file_path,
                    mime_type: 'image/url',
                    file_size: null,
                })
                .select()
                .single()

            if (error) throw error

            return data
        },

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['orders'],
            })
            queryClient.invalidateQueries({
                queryKey: ['orders', data.order_id],
            })
        },
    })
}