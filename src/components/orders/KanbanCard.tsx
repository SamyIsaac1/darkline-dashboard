import { Link } from 'react-router-dom'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OrderWithRelations, Status } from '@/types/collection'

interface KanbanCardProps {
  order: OrderWithRelations
  status: Status | null
}

export default function KanbanCard({ order, status }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: order.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Link to={`/orders/${order.id}`}>
      <div ref={setNodeRef} style={style}>
        <Card
          className={cn(
            'p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow',
            isDragging && 'shadow-lg'
          )}
        >
          <div className="flex gap-2">
            <button
              {...attributes}
              {...listeners}
              className="flex-shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
            >
              <GripVertical className="w-4 h-4" />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-mono font-bold truncate">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {order.client?.name || 'No client'}
                  </p>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {status && (
                  <Badge
                    style={{ backgroundColor: status.color ?? undefined }}
                    className="text-white text-xs"
                  >
                    {status.name}
                  </Badge>
                )}
              </div>

              {order.total_cost != null && (
                <p className="text-xs font-semibold mt-2">${order.total_cost.toFixed(2)}</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </Link>
  )
}
