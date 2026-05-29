import { Card } from '@/components/ui/card'
import { DollarSign, Wallet, Banknote, ClipboardList } from 'lucide-react'
import {
  getCompletedRevenue,
  getTotalOutstanding,
  getTotalDeposits,
} from '@/lib/analytics/orderRevenue'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import type { OrderWithRelations } from '@/types/collection'

interface RevenueMetricsGridProps {
  orders: OrderWithRelations[]
}

export default function RevenueMetricsGrid({ orders }: RevenueMetricsGridProps) {
  const metrics = [
    {
      label: 'Total Revenue',
      value: formatCurrency(getCompletedRevenue(orders)),
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Remaining to Collect',
      value: formatCurrency(getTotalOutstanding(orders)),
      icon: Wallet,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Deposits Collected',
      value: formatCurrency(getTotalDeposits(orders)),
      icon: Banknote,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Total Orders',
      value: String(orders.length),
      icon: ClipboardList,
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <Card key={metric.label} className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <p className="text-lg font-semibold mt-1 tabular-nums truncate">{metric.value}</p>
              </div>
              <div className={`p-2 rounded-lg shrink-0 ${metric.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
