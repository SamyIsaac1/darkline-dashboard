import { Link } from 'react-router-dom'
import { useUIStore } from '@/lib/store/uiStore'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, DollarSign, User, ArrowRight } from 'lucide-react'

interface OrdersGridProps {
  orders: any[]
}

export default function OrdersGrid({ orders }: OrdersGridProps) {
  const {
    searchQuery,
    selectedStatus,
    selectedStage,
    selectedTags,
  } = useUIStore()

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = !selectedStatus || order.status_id === selectedStatus
    const matchesStage = !selectedStage || order.stage_id === selectedStage
    const matchesTags =
      selectedTags.length === 0 ||
      order.tags?.some((ot: any) => selectedTags.includes(ot.tag_id))

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredOrders.map((order) => (
        <Card
          key={order.id}
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <Link to={`/orders/${order.id}`}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Order</p>
                  <p className="text-lg font-mono font-bold">
                    {order.order_number}
                  </p>
                </div>
                <Badge
                  style={{
                    backgroundColor: order.status?.color || '#3B82F6',
                  }}
                  className="text-white"
                >
                  {order.status?.name || 'Unknown'}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {order.customer_name}
                </p>
              </div>

              {order.due_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Due: {new Date(order.due_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {order.total_cost && (
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <DollarSign className="w-4 h-4" />
                  ${order.total_cost.toFixed(2)}
                </div>
              )}

              {order.tags && order.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {order.tags.map((ot: any) => (
                    <Badge
                      key={ot.tag_id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {ot.tag?.name || 'Tag'}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {order.stage?.name || 'No Stage'}
                </p>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  )
}
