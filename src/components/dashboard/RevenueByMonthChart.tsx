import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { getRevenueByMonth } from '@/lib/analytics/orderRevenue'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import type { OrderWithRelations } from '@/types/collection'

interface RevenueByMonthChartProps {
  orders: OrderWithRelations[]
}

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export default function RevenueByMonthChart({ orders }: RevenueByMonthChartProps) {
  const chartData = getRevenueByMonth(orders)
  const hasData = chartData.some((d) => d.revenue > 0)

  if (!hasData) {
    return (
      <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
        No completed order revenue yet
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-[240px] w-full">
      <AreaChart data={chartData} accessibilityLayer>
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
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value: number | string) =>
                formatCurrency(Number(value))
              }
            />
          }
        />
        <Area
          dataKey="revenue"
          type="monotone"
          fill="var(--color-revenue)"
          fillOpacity={0.3}
          stroke="var(--color-revenue)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}
