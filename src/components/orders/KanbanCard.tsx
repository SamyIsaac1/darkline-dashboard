import { Link } from 'react-router-dom'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils/formatCurrency'
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
    <div ref={setNodeRef} style={style} className="w-full min-w-0">
      <Card
        className={cn(
          'w-full min-w-0 p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow',
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
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-sm font-mono font-bold truncate hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {order.order_number}
                  </Link>
                  <p className="text-xs text-muted-foreground truncate">
                    {order.client?.name || 'No client'}
                  </p>
                </div>
              </div>
              <div className="mt-2 space-y-0.5 text-xs">
                <p>
                  <span className="text-muted-foreground">Deposit </span>
                  <span className="font-semibold">{formatCurrency(order.deposit)}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Total </span>
                  <span className="font-semibold">{formatCurrency(order.total_cost)}</span>
                </p>
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

            </div>
          </div>
        </Card>
    </div>
  )
}
