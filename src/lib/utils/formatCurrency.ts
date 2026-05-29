export function formatCurrency(value: number | null | undefined): string {
  return value != null ? `$${value.toFixed(2)}` : '—'
}
