
import { useOrders } from '@/lib/hooks/useOrders'
import { useStatuses, useStages, useTags } from '@/lib/hooks/useReferenceData'
import { useUIStore } from '@/lib/store/uiStore'
import { Button } from '@/components/ui/button'
import OrdersGrid from '@/components/orders/OrdersGrid'
import OrdersList from '@/components/orders/OrdersList'
import KanbanBoard from '@/components/orders/KanbanBoard'
import OrdersFilter from '@/components/orders/OrdersFilter'
import OrderModal from '@/components/orders/OrderModal'
import { Kanban, LayoutGrid, List, Plus } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

export default function OrdersContent() {
  const { data: orders, isLoading } = useOrders()
  const { data: statuses } = useStatuses()
  const { data: stages } = useStages()
  const { data: tags } = useTags()

  const { viewMode, setViewMode, setOrderModalOpen } = useUIStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-w-0 space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">Orders</h1>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              onClick={() => setViewMode('kanban')}
            >
              <Kanban className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button onClick={() => setOrderModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      <OrdersFilter
        statuses={statuses || []}
        stages={stages || []}
        tags={tags || []}
      />

      {viewMode === 'grid' && <OrdersGrid orders={orders || []} />}
      {viewMode === 'kanban' && (
        <div className="min-w-0 max-w-full overflow-x-hidden">
          <KanbanBoard
            orders={orders || []}
            stages={stages || []}
            statuses={statuses || []}
          />
        </div>
      )}
      {viewMode === 'list' && <OrdersList orders={orders || []} />}

      <OrderModal />
    </div>
  )
}
