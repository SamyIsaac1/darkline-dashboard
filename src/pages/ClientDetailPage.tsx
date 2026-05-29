import { useParams } from 'react-router-dom'
import { ClientDetail } from '@/components/clients'

export default function ClientDetailPage() {
  const { id } = useParams()
  if (!id) return null
  return <ClientDetail clientId={id} />
}
