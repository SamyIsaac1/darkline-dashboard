import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useClient, useDeleteClient } from '@/lib/hooks/useClients'
import { useDeleteConfirm } from '@/lib/hooks/useDeleteConfirm'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import WhatsAppPhoneLink from '@/components/shared/whatsapp-phone-link'
import ClientModal from './ClientModal'

interface ClientDetailProps {
  clientId: string
}

export default function ClientDetail({ clientId }: ClientDetailProps) {
  const navigate = useNavigate()
  const { data: client, isLoading } = useClient(clientId)
  const deleteClient = useDeleteClient()
  const { confirmDelete } = useDeleteConfirm()
  const [editOpen, setEditOpen] = useState(false)

  const handleDelete = () => {
    confirmDelete({
      title: 'Delete this client?',
      description: 'Orders linked to this client may be affected. This cannot be undone.',
      onConfirm: async () => {
        await deleteClient.mutateAsync(clientId)
        navigate('/clients')
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Client not found</p>
        <Link to="/clients">
          <Button>Back to Clients</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/clients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{client.name || 'Unnamed'}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteClient.isPending}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-muted-foreground">Phone</dt>
            <dd className="font-medium">
              {client.phone ? (
                <WhatsAppPhoneLink phone={client.phone} className="text-foreground" />
              ) : (
                '—'
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Phone 2</dt>
            <dd className="font-medium">
              {client.phone_2 ? (
                <WhatsAppPhoneLink phone={client.phone_2} className="text-foreground" />
              ) : (
                '—'
              )}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm text-muted-foreground">Address</dt>
            <dd className="font-medium">{client.address || '—'}</dd>
          </div>
        </dl>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Orders</h2>
        {client.orders?.length ? (
          <ul className="space-y-2">
            {client.orders.map((order) => (
              <li key={order.id}>
                <Link
                  to={`/orders/${order.id}`}
                  className="text-primary hover:underline font-mono"
                >
                  {order.order_number}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No orders for this client yet.</p>
        )}
      </Card>

      <ClientModal open={editOpen} onOpenChange={setEditOpen} client={client} />
    </div>
  )
}
