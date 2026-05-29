
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
        'flex w-full min-w-0 shrink-0 flex-col rounded-lg bg-muted p-3 transition-colors sm:p-4',
        'md:w-72 md:snap-start lg:w-80 xl:w-96',
        isOver && 'bg-muted-foreground/10'
      )}
    >
      <div className="mb-3 flex shrink-0 items-center gap-2 sm:mb-4">
        <div
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: stage.color }}
        />
        <h3 className="truncate font-semibold text-foreground">{stage.name}</h3>
        <span className="ml-auto shrink-0 rounded bg-background px-2 py-1 text-sm text-muted-foreground">
          {orders.length}
        </span>
      </div>

      <SortableContext
        items={orders.map((o) => o.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 md:max-h-[min(70vh,calc(100dvh-14rem))] md:overflow-y-auto md:overscroll-y-contain md:pr-0.5">
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
