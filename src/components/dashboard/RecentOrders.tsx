import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import type { OrderWithRelations } from '@/types/collection'

interface RecentOrdersProps {
  orders: OrderWithRelations[]
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No orders yet</p>
        <Link to="/orders">
          <Button className="mt-4">Create First Order</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-sm">Order #</th>
            <th className="text-left py-3 px-4 font-semibold text-sm">Client</th>
            <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-sm">Total</th>
            <th className="text-left py-3 px-4 font-semibold text-sm">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-border hover:bg-accent">
              <td className="py-3 px-4 font-mono text-sm">{order.order_number}</td>
              <td className="py-3 px-4 text-sm">{order.client?.name || '—'}</td>
              <td className="py-3 px-4">
                <Badge
                  style={{ backgroundColor: order.status?.color || '#3B82F6' }}
                  className="text-white"
                >
                  {order.status?.name || 'Unknown'}
                </Badge>
              </td>
              <td className="py-3 px-4 text-sm font-semibold">
                {order.total_cost != null ? `$${order.total_cost.toFixed(2)}` : 'N/A'}
              </td>
              <td className="py-3 px-4">
                <Link to={`/orders/${order.id}`}>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
