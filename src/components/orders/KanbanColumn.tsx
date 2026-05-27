
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import KanbanCard from '@/components/orders/KanbanCard'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  stage: any
  orders: any[]
  statuses: any[]
}

export default function KanbanColumn({ stage, orders, statuses }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex-shrink-0 w-96 bg-muted rounded-lg p-4 transition-colors',
        isOver && 'bg-muted-foreground/10'
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: stage.color }}
        />
        <h3 className="font-semibold text-foreground">{stage.name}</h3>
        <span className="ml-auto text-sm text-muted-foreground bg-background px-2 py-1 rounded">
          {orders.length}
        </span>
      </div>

      <SortableContext
        items={orders.map((o) => o.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No orders in this stage
            </div>
          ) : (
            orders.map((order) => (
              <KanbanCard
                key={order.id}
                order={order}
                status={statuses.find((s) => s.id === order.status_id)}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}
