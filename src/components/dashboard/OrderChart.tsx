
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface OrderChartProps {
  orders: any[]
  statuses: any[]
}

export default function OrderChart({ orders, statuses }: OrderChartProps) {
  const chartData = statuses.map((status) => ({
    name: status.name,
    count: orders.filter((o) => o.status_id === status.id).length,
    fill: status.color,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  )
}
