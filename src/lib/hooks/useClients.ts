import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { softDeleteFields } from '@/lib/supabase/softDelete'
import type { TablesInsert, TablesUpdate } from '@/types/supabase'
import type { ClientWithOrders } from '@/types/collection'

const CLIENT_ORDERS_SELECT = `
  *,
  orders(
    *,
    status:statuses(*),
    stage:stages(*),
    tags:order_tags(tag:tags(*))
  )
`

type ClientInsert = TablesInsert<'clients'>
type ClientUpdate = TablesUpdate<'clients'>

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('deleted', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })
}

export function useClient(clientId: string) {
  return useQuery({
    queryKey: ['clients', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select(CLIENT_ORDERS_SELECT)
        .eq('id', clientId)
        .single()

      if (error) throw error
      return data as ClientWithOrders
    },
    enabled: !!clientId,
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (client: ClientInsert) => {
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: ClientUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .eq('deleted', false)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['clients', data.id] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (clientId: string) => {
      const { deleted, deleted_at } = softDeleteFields()

      const { error } = await supabase
        .from('clients')
        .update({ deleted, deleted_at })
        .eq('id', clientId)
        .eq('deleted', false)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}
