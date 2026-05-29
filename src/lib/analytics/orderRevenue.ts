import type { OrderWithRelations } from '@/types/collection'

export function isCompletedOrder(order: OrderWithRelations): boolean {
  const name = order.status?.name
  return name === 'Completed' || name === 'Delivered'
}

export function getCompletedRevenue(orders: OrderWithRelations[]): number {
  return orders
    .filter(isCompletedOrder)
    .reduce((sum, o) => sum + (o.total_cost ?? 0), 0)
}

export function getOutstandingBalance(order: OrderWithRelations): number {
  const total = order.total_cost ?? 0
  const deposit = order.deposit ?? 0
  return Math.max(0, total - deposit)
}

export function getTotalOutstanding(orders: OrderWithRelations[]): number {
  return orders.reduce((sum, o) => {
    const balance = getOutstandingBalance(o)
    return balance > 0 ? sum + balance : sum
  }, 0)
}

export function getTotalDeposits(orders: OrderWithRelations[]): number {
  return orders.reduce((sum, o) => sum + (o.deposit ?? 0), 0)
}

export type RevenueByMonth = {
  month: string
  revenue: number
  label: string
}

export function getRevenueByMonth(orders: OrderWithRelations[]): RevenueByMonth[] {
  const completed = orders.filter(isCompletedOrder)
  const now = new Date()
  const months: RevenueByMonth[] = []

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = d.getFullYear()
    const month = d.getMonth()
    const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`

    const revenue = completed
      .filter((o) => {
        if (!o.created_at) return false
        const created = new Date(o.created_at)
        return created.getFullYear() === year && created.getMonth() === month
      })
      .reduce((sum, o) => sum + (o.total_cost ?? 0), 0)

    months.push({ month: monthKey, revenue, label })
  }

  return months
}
