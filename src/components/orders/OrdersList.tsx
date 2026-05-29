import { Link } from 'react-router-dom'
import { useUIStore } from '@/lib/store/uiStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowRight } from 'lucide-react'
import type { OrderWithRelations } from '@/types/collection'

interface OrdersListProps {
  orders: OrderWithRelations[]
  hideClientColumn?: boolean
  applyFilters?: boolean
  emptyMessage?: string
}

function formatCurrency(value: number | null | undefined): string {
  return value != null ? `$${value.toFixed(2)}` : '—'
}

function formatDateRange(order: OrderWithRelations): string {
  if (order.start_date && order.end_date) {
    return `${new Date(order.start_date).toLocaleDateString()} – ${new Date(order.end_date).toLocaleDateString()}`
  }
  if (order.end_date) return new Date(order.end_date).toLocaleDateString()
  if (order.start_date) return new Date(order.start_date).toLocaleDateString()
  return '—'
}

export default function OrdersList({
  orders,
  hideClientColumn = false,
  applyFilters = true,
  emptyMessage = 'No orders found',
}: OrdersListProps) {
  const { searchQuery, selectedStatus, selectedStage, selectedTags } = useUIStore()

  const filteredOrders = applyFilters
    ? orders.filter((order) => {
        const clientName = order.client?.name?.toLowerCase() ?? ''
        const description = order.description?.toLowerCase() ?? ''
        const matchesSearch =
          order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          clientName.includes(searchQuery.toLowerCase()) ||
          description.includes(searchQuery.toLowerCase())

        const matchesStatus = !selectedStatus || order.status_id === selectedStatus
        const matchesStage = !selectedStage || order.stage_id === selectedStage
        const matchesTags =
          selectedTags.length === 0 ||
          order.tags?.some((ot) => selectedTags.includes(ot.tag_id))

        return matchesSearch && matchesStatus && matchesStage && matchesTags
      })
    : orders

  if (filteredOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <Card className="p-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            {!hideClientColumn && <TableHead>Client</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead className="text-right">Deposit</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono font-medium">{order.order_number}</TableCell>
              {!hideClientColumn && <TableCell>{order.client?.name || '—'}</TableCell>}
              <TableCell>
                <Badge
                  style={{ backgroundColor: order.status?.color || '#3B82F6' }}
                  className="text-white"
                >
                  {order.status?.name || 'Unknown'}
                </Badge>
              </TableCell>
              <TableCell>{order.stage?.name || '—'}</TableCell>
              <TableCell className="text-muted-foreground">{formatDateRange(order)}</TableCell>
              <TableCell className="text-right">{formatCurrency(order.deposit)}</TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(order.total_cost)}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {order.tags?.length ? (
                    order.tags.map((ot) => (
                      <Badge key={ot.tag_id} variant="secondary" className="text-xs">
                        {ot.tag?.name || 'Tag'}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Link to={`/orders/${order.id}`}>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
