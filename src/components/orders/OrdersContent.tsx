
import { useOrders } from '@/lib/hooks/useOrders'
import { useStatuses, useStages, useTags } from '@/lib/hooks/useReferenceData'
import { useUIStore } from '@/lib/store/uiStore'
import { Button } from '@/components/ui/button'
import OrdersGrid from '@/components/orders/OrdersGrid'
import KanbanBoard from '@/components/orders/KanbanBoard'
import OrdersFilter from '@/components/orders/OrdersFilter'
import OrderModal from '@/components/orders/OrderModal'
import { Kanban, LayoutGrid, Plus } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

export default function OrdersContent() {
  const { data: orders, isLoading } = useOrders()
  const { data: statuses } = useStatuses()
  const { data: stages } = useStages()
  const { data: tags } = useTags()

  const { viewMode, setViewMode, isOrderModalOpen, setOrderModalOpen } =
    useUIStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="flex gap-2">
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
          </div>
          <Button onClick={() => setOrderModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* <OrdersFilter
        statuses={statuses || []}
        stages={stages || []}
        tags={tags || []}
      /> */}

      {viewMode === 'grid' ? (
        <OrdersGrid
          orders={orders || []}
        />
      ) : (
        <KanbanBoard
          orders={orders || []}
          stages={stages || []}
          statuses={statuses || []}
        />
      )}

      <OrderModal />
    </div>
  )
}
