import { create } from 'zustand'

interface UIState {
  // View mode
  viewMode: 'grid' | 'kanban' | 'list'
  setViewMode: (mode: 'grid' | 'kanban' | 'list') => void

  // Filters
  selectedStatus: string | null
  setSelectedStatus: (status: string | null) => void

  selectedStage: string | null
  setSelectedStage: (stage: string | null) => void

  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
  addSelectedTag: (tag: string) => void
  removeSelectedTag: (tag: string) => void

  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Modal
  isOrderModalOpen: boolean
  setOrderModalOpen: (open: boolean) => void

  selectedOrderId: string | null
  setSelectedOrderId: (id: string | null) => void

  // Reset filters
  resetFilters: () => void
}

export const useUIStore = create<UIState>((set) => ({
  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),

  selectedStatus: null,
  setSelectedStatus: (status) => set({ selectedStatus: status }),

  selectedStage: null,
  setSelectedStage: (stage) => set({ selectedStage: stage }),

  selectedTags: [],
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  addSelectedTag: (tag) =>
    set((state) => ({
      selectedTags: [...state.selectedTags, tag],
    })),
  removeSelectedTag: (tag) =>
    set((state) => ({
      selectedTags: state.selectedTags.filter((t) => t !== tag),
    })),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  isOrderModalOpen: false,
  setOrderModalOpen: (open) => set({ isOrderModalOpen: open }),

  selectedOrderId: null,
  setSelectedOrderId: (id) => set({ selectedOrderId: id }),

  resetFilters: () =>
    set({
      selectedStatus: null,
      selectedStage: null,
      selectedTags: [],
      searchQuery: '',
    }),
}))
