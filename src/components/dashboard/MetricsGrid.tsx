
import { Card } from '@/components/ui/card'
import { TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

interface MetricsGridProps {
  orders: any[]
}

export default function MetricsGrid({ orders }: MetricsGridProps) {
  const totalOrders = orders.length
  const completedOrders = orders.filter(
    (o) =>
      o.status?.name === 'Completed' ||
      o.status?.name === 'Delivered'
  ).length
  const inProgressOrders = orders.filter(
    (o) => o.status?.name === 'In Progress'
  ).length
  const pendingOrders = orders.filter(
    (o) => o.status?.name === 'Pending'
  ).length

  const metrics = [
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'In Progress',
      value: inProgressOrders,
      icon: Clock,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Completed',
      value: completedOrders,
      icon: CheckCircle2,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Pending',
      value: pendingOrders,
      icon: AlertCircle,
      color: 'bg-red-100 text-red-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <Card key={metric.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-3xl font-bold mt-2">{metric.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${metric.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
