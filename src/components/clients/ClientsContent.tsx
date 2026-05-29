import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useClients } from '@/lib/hooks/useClients'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Plus, Search, Phone, MapPin } from 'lucide-react'
import ClientModal from './ClientModal'

export default function ClientsContent() {
  const { data: clients, isLoading } = useClients()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = (clients || []).filter((c) => {
    const q = search.toLowerCase()
    return (
      (c.name?.toLowerCase().includes(q) ?? false) ||
      (c.phone?.toLowerCase().includes(q) ?? false) ||
      (c.address?.toLowerCase().includes(q) ?? false)
    )
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Client
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No clients found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client) => (
            <Link key={client.id} to={`/clients/${client.id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-lg">{client.name || 'Unnamed'}</h3>
                {client.phone && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                    <Phone className="w-4 h-4" />
                    {client.phone}
                  </p>
                )}
                {client.address && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4" />
                    {client.address}
                  </p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}

      <ClientModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
