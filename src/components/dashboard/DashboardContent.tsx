
import { useOrders } from '@/lib/hooks/useOrders'
import { Card } from '@/components/ui/card'
import RevenueMetricsGrid from '@/components/dashboard/RevenueMetricsGrid'
import RevenueByMonthChart from '@/components/dashboard/RevenueByMonthChart'
import OrdersByMonthChart from '@/components/dashboard/OrdersByMonthChart'
import RecentOrders from '@/components/dashboard/RecentOrders'
import { Spinner } from '@/components/ui/spinner'

export default function DashboardContent() {
  const { data: orders, isLoading: ordersLoading } = useOrders()

  const isLoading = ordersLoading
  const orderList = orders || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 md:p-6">
      <RevenueMetricsGrid orders={orderList} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-4">
          <h2 className="text-sm font-semibold mb-3">Revenue by Month</h2>
          <RevenueByMonthChart orders={orderList} />
        </Card>

        <Card className="p-4">
          <h2 className="text-sm font-semibold mb-3">Orders by Month</h2>
          <OrdersByMonthChart orders={orderList} />
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="text-sm font-semibold mb-3">Recent Orders</h2>
        <RecentOrders orders={orderList.slice(0, 5)} />
      </Card>
    </div>
  )
}
