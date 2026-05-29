import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { getOrdersByMonth } from '@/lib/analytics/orderAnalytics'
import type { OrderWithRelations } from '@/types/collection'

interface OrdersByMonthChartProps {
  orders: OrderWithRelations[]
}

const chartConfig = {
  count: {
    label: 'Orders',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export default function OrdersByMonthChart({ orders }: OrdersByMonthChartProps) {
  const chartData = getOrdersByMonth(orders)
  const hasData = chartData.some((d) => d.count > 0)

  if (!hasData) {
    return (
      <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
        No orders yet
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-[240px] w-full">
      <BarChart data={chartData} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => {
            const [month] = String(value).split(' ')
            return month
          }}
        />
        <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
