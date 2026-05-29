import { Link } from 'react-router-dom'
import { useUIStore } from '@/lib/store/uiStore'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, DollarSign, User, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import type { OrderWithRelations } from '@/types/collection'

interface OrdersGridProps {
  orders: OrderWithRelations[]
}

export default function OrdersGrid({ orders }: OrdersGridProps) {
  const { searchQuery, selectedStatus, selectedStage, selectedTags } = useUIStore()

  const filteredOrders = orders.filter((order) => {
    const clientName = order.client?.name?.toLowerCase() ?? ''
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clientName.includes(searchQuery.toLowerCase())

    const matchesStatus = !selectedStatus || order.status_id === selectedStatus
    const matchesStage = !selectedStage || order.stage_id === selectedStage
    const matchesTags =
      selectedTags.length === 0 ||
      order.tags?.some((ot) => selectedTags.includes(ot.tag_id))

    return matchesSearch && matchesStatus && matchesStage && matchesTags
  })

  if (filteredOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No orders found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredOrders.map((order) => (
        <Card
          key={order.id}
          className="flex h-full flex-col p-6 transition-shadow cursor-pointer hover:shadow-lg"
        >
          <Link to={`/orders/${order.id}`} className="flex h-full flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Order</p>
                  <p className="text-lg font-mono font-bold">{order.order_number}</p>
                </div>
                <Badge
                  style={{ backgroundColor: order.status?.color || '#3B82F6' }}
                  className="text-white"
                >
                  {order.status?.name || 'Unknown'}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                {order.client?.name || 'No client'}
              </p>

              {(order.start_date || order.end_date) && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {order.start_date && order.end_date
                      ? `${new Date(order.start_date).toLocaleDateString()} – ${new Date(order.end_date).toLocaleDateString()}`
                      : order.end_date
                        ? `End: ${new Date(order.end_date).toLocaleDateString()}`
                        : `Start: ${new Date(order.start_date!).toLocaleDateString()}`}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <DollarSign className="h-4 w-4 shrink-0 text-muted-foreground" />
                <p>
                  <span className="text-muted-foreground">Deposit </span>
                  <span className="font-semibold">{formatCurrency(order.deposit)}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Total </span>
                  <span className="font-semibold">{formatCurrency(order.total_cost)}</span>
                </p>
              </div>

              {order.tags && order.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {order.tags.map((ot) => (
                    <Badge key={ot.tag_id} variant="secondary" className="text-xs">
                      {ot.tag?.name || 'Tag'}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">{order.stage?.name || 'No Stage'}</p>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  )
}
