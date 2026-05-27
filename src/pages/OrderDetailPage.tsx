import { useParams } from 'react-router-dom'
import OrderDetail from '@/components/orders/OrderDetail'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return <div>Order not found</div>
  }

  return <OrderDetail orderId={id} />
}
