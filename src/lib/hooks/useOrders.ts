import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { TablesInsert, TablesUpdate } from '@/types/supabase'

type OrderInsert = TablesInsert<'orders'>
type OrderUpdate = TablesUpdate<'orders'>

export function useOrders() {

  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          status:statuses(*),
          stage:stages(*),
          tags:order_tags(tag:tags(*))
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as any[]
    },
  })
}

export function useOrder(orderId: string) {

  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          status:statuses(*),
          stage:stages(*),
          tags:order_tags(tag:tags(*)),
          activities(*),
          attachments(*)
        `)
        .eq('id', orderId)
        .single()

      if (error) throw error
      return data as any
    },
    enabled: !!orderId,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (order: Partial<OrderInsert>) => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('orders')
        .insert({
          ...order,
          created_by: userData.user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useUpdateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: OrderUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', data.id] })
    },
  })
}

export function useDeleteOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      orderId: string
    ) => {
      // delete activities
      const {
        error: activitiesError,
      } = await supabase
        .from('activities')
        .delete()
        .eq('order_id', orderId)

      if (activitiesError)
        throw activitiesError

      // delete attachments
      const {
        error: attachmentsError,
      } = await supabase
        .from('attachments')
        .delete()
        .eq('order_id', orderId)

      if (attachmentsError)
        throw attachmentsError

      // delete tags
      const {
        error: tagsError,
      } = await supabase
        .from('order_tags')
        .delete()
        .eq('order_id', orderId)

      if (tagsError)
        throw tagsError

      // finally delete order
      const { error } =
        await supabase
          .from('orders')
          .delete()
          .eq('id', orderId)

      if (error) throw error
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['orders'],
      })
    },
  })
}

export function useAddOrderTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      orderId,
      tagId,
    }: {
      orderId: string
      tagId: string
    }) => {
      const { error } = await supabase
        .from('order_tags')
        .insert({ order_id: orderId, tag_id: tagId })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useRemoveOrderTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      orderId,
      tagId,
    }: {
      orderId: string
      tagId: string
    }) => {
      const { error } = await supabase
        .from('order_tags')
        .delete()
        .eq('order_id', orderId)
        .eq('tag_id', tagId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useAddActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      orderId,
      activityType,
      description,
    }: {
      orderId: string
      activityType: string
      description: string
    }) => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('Not authenticated')

      const { error } = await supabase.from('activities').insert({
        order_id: orderId,
        activity_type: activityType,
        description,
        created_by: userData.user.id,
      })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
