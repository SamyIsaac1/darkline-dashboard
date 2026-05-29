import type { OrderWithRelations } from '@/types/collection'

export type OrdersByMonth = {
  month: string
  count: number
  label: string
}

export function getOrdersByMonth(orders: OrderWithRelations[]): OrdersByMonth[] {
  const now = new Date()
  const months: OrdersByMonth[] = []

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = d.getFullYear()
    const month = d.getMonth()
    const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`

    const count = orders.filter((o) => {
      if (!o.created_at) return false
      const created = new Date(o.created_at)
      return created.getFullYear() === year && created.getMonth() === month
    }).length

    months.push({ month: monthKey, count, label })
  }

  return months
}
