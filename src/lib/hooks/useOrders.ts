import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { softDeleteFields } from '@/lib/supabase/softDelete'
import type { TablesInsert, TablesUpdate } from '@/types/supabase'
import type { OrderDetail, OrderWithRelations } from '@/types/collection'

type OrderInsert = TablesInsert<'orders'>
type OrderUpdate = TablesUpdate<'orders'>

export type InlineClientInput = {
  name: string
  phone?: string | null
  phone_2?: string | null
  address?: string | null
}

export type CreateOrderInput = Partial<OrderInsert> & {
  client_id?: string | null
  inlineClient?: InlineClientInput
}

const ORDER_LIST_SELECT = `
  *,
  client:clients(*),
  status:statuses(*),
  stage:stages(*),
  tags:order_tags(tag:tags(*))
`

const ORDER_DETAIL_SELECT = `
  *,
  client:clients(*),
  status:statuses(*),
  stage:stages(*),
  tags:order_tags(tag:tags(*)),
  activities(*),
  attachments(*)
`

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(ORDER_LIST_SELECT)
        .eq('deleted', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as OrderWithRelations[]
    },
  })
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(ORDER_DETAIL_SELECT)
        .eq('id', orderId)
        .eq('deleted', false)
        .single()

      if (error) throw error
      return data as OrderDetail
    },
    enabled: !!orderId,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('Not authenticated')

      const { inlineClient, client_id, ...orderFields } = input
      let resolvedClientId = client_id ?? null

      if (!resolvedClientId && inlineClient) {
        const { data: client, error: clientError } = await supabase
          .from('clients')
          .insert({
            name: inlineClient.name,
            phone: inlineClient.phone ?? null,
            phone_2: inlineClient.phone_2 ?? null,
            address: inlineClient.address ?? null,
          })
          .select()
          .single()

        if (clientError) throw clientError
        resolvedClientId = client.id
      }

      const { data, error } = await supabase
        .from('orders')
        .insert({
          ...orderFields,
          client_id: resolvedClientId,
          created_by: userData.user.id,
        } as OrderInsert)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}

export function useUpdateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: OrderUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('deleted', false)
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
    mutationFn: async (orderId: string) => {
      const { deleted_at, deleted } = softDeleteFields()

      const { error } = await supabase
        .from('orders')
        .update({ deleted, deleted_at, updated_at: deleted_at })
        .eq('id', orderId)
        .eq('deleted', false)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] })
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
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] })
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
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] })
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
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] })
    },
  })
}
