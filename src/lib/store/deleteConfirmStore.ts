import { create } from 'zustand'

export interface DeleteConfirmRequest {
  title?: string
  description?: string
  itemName?: string
  confirmLabel?: string
  onConfirm: () => void | Promise<void>
}

interface DeleteConfirmState {
  open: boolean
  isPending: boolean
  title: string
  description: string
  confirmLabel: string
  onConfirm: (() => void | Promise<void>) | null
  requestDelete: (request: DeleteConfirmRequest) => void
  setOpen: (open: boolean) => void
  confirm: () => Promise<void>
  reset: () => void
}

const DEFAULT_TITLE = 'Delete this item?'
const DEFAULT_DESCRIPTION = 'This will remove it from the dashboard.'

function buildTitle(request: DeleteConfirmRequest): string {
  if (request.title) return request.title
  if (request.itemName) return `Delete "${request.itemName}"?`
  return DEFAULT_TITLE
}

export const useDeleteConfirmStore = create<DeleteConfirmState>((set, get) => ({
  open: false,
  isPending: false,
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  confirmLabel: 'Delete',
  onConfirm: null,

  requestDelete: (request) => {
    set({
      open: true,
      isPending: false,
      title: buildTitle(request),
      description: request.description ?? DEFAULT_DESCRIPTION,
      confirmLabel: request.confirmLabel ?? 'Delete',
      onConfirm: request.onConfirm,
    })
  },

  setOpen: (open) => {
    if (!open && !get().isPending) {
      get().reset()
      return
    }
    set({ open })
  },

  confirm: async () => {
    const { onConfirm } = get()
    if (!onConfirm) return

    set({ isPending: true })
    try {
      await onConfirm()
      get().reset()
    } catch {
      set({ isPending: false })
    }
  },

  reset: () =>
    set({
      open: false,
      isPending: false,
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      confirmLabel: 'Delete',
      onConfirm: null,
    }),
}))
