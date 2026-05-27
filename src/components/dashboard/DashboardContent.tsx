
import { useOrders } from '@/lib/hooks/useOrders'
import { useTags, useStages, useStatuses } from '@/lib/hooks/useReferenceData'
import { Card } from '@/components/ui/card'
import MetricsGrid from '@/components/dashboard/MetricsGrid'
import OrderChart from '@/components/dashboard/OrderChart'
import RecentOrders from '@/components/dashboard/RecentOrders'
import { Spinner } from '@/components/ui/spinner'

export default function DashboardContent() {
  const { data: orders, isLoading: ordersLoading } = useOrders()
  const { data: statuses, isLoading: statusesLoading } = useStatuses()
  const { data: stages, isLoading: stagesLoading } = useStages()
  const { data: tags } = useTags()

  const isLoading = ordersLoading || statusesLoading || stagesLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <MetricsGrid orders={orders || []} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold mb-4">Orders by Status</h2>
          <OrderChart orders={orders || []} statuses={statuses || []} />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Stages</p>
              <p className="text-2xl font-bold">{stages?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Tags</p>
              <p className="text-2xl font-bold">{tags?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{orders?.length || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <RecentOrders orders={orders?.slice(0, 5) || []} />
      </Card>
    </div>
  )
}
