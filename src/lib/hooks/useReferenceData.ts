import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

export function useStatuses() {

  return useQuery({
    queryKey: ['statuses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('statuses')
        .select('*')
        .order('position', { ascending: true })

      if (error) throw error
      return data
    },
  })
}

export function useStages() {

  return useQuery({
    queryKey: ['stages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stages')
        .select('*')
        .order('position', { ascending: true })

      if (error) throw error
      return data
    },
  })
}

export function useTags() {

  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      return data
    },
  })
}
