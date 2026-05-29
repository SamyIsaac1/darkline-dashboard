import {
  useDeleteConfirmStore,
  type DeleteConfirmRequest,
} from '@/lib/store/deleteConfirmStore'

export function useDeleteConfirm() {
  const requestDelete = useDeleteConfirmStore((s) => s.requestDelete)
  return { confirmDelete: requestDelete }
}

export type { DeleteConfirmRequest }
