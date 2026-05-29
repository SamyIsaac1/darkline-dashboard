import { Link, useNavigate } from 'react-router-dom'
import {
  useOrder,
  useUpdateOrder,
  useDeleteOrder,
  useAddActivity,
} from '@/lib/hooks/useOrders'
import { useUpdateClient } from '@/lib/hooks/useClients'
import { useDeleteConfirm } from '@/lib/hooks/useDeleteConfirm'
import { useStatuses, useStages } from '@/lib/hooks/useReferenceData'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  Phone,
  Trash2,
  MapPin,
  MessageCircle,
  Loader2,
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import AttachmentForm from './AttachmentForm'
import AttachmentItem from './AttachmentItem'

interface OrderDetailProps {
  orderId: string
}

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const navigate = useNavigate()
  const { data: order, isLoading } = useOrder(orderId)
  const { data: statuses } = useStatuses()
  const { data: stages } = useStages()
  const updateOrder = useUpdateOrder()
  const updateClient = useUpdateClient()
  const deleteOrder = useDeleteOrder()
  const addActivity = useAddActivity()
  const { confirmDelete } = useDeleteConfirm()

  const [activityText, setActivityText] = useState('')

  const [clientData, setClientData] = useState({
    name: '',
    phone: '',
    phone_2: '',
    address: '',
  })

  const [orderData, setOrderData] = useState({
    description: '',
    notes: '',
    delivery_address: '',
    deposit: 0,
    total_cost: 0,
    shipping_price: 0,
    shipping_included_in_total: false,
    start_date: '',
    end_date: '',
    method_of_contact: '',
  })

  useEffect(() => {
    if (order) {
      setClientData({
        name: order.client?.name || '',
        phone: order.client?.phone || '',
        phone_2: order.client?.phone_2 || '',
        address: order.client?.address || '',
      })
      setOrderData({
        description: order.description || '',
        notes: order.notes || '',
        delivery_address: order.delivery_address || '',
        deposit: order.deposit || 0,
        total_cost: order.total_cost || 0,
        shipping_price: order.shipping_price || 0,
        shipping_included_in_total: order.shipping_included_in_total ?? false,
        start_date: order.start_date || '',
        end_date: order.end_date || '',
        method_of_contact: order.method_of_contact || '',
      })
    }
  }, [order])

  const handleOrderFieldUpdate = async (
    field: string,
    value: string | number | boolean | null,
  ) => {
    setOrderData((prev) => ({ ...prev, [field]: value }))
    await updateOrder.mutateAsync({ id: orderId, [field]: value })
  }

  const handleClientFieldUpdate = async (field: string, value: string) => {
    if (!order?.client_id) return
    setClientData((prev) => ({ ...prev, [field]: value }))
    await updateClient.mutateAsync({
      id: order.client_id,
      [field]: value || null,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Order not found</p>
          <Link to="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleStatusChange = async (newStatusId: string) => {
    await updateOrder.mutateAsync({ id: orderId, status_id: newStatusId })
    addActivity.mutate({
      orderId,
      activityType: 'status_change',
      description: `Status changed to ${statuses?.find((s) => s.id === newStatusId)?.name}`,
    })
  }

  const handleStageChange = async (newStageId: string) => {
    await updateOrder.mutateAsync({ id: orderId, stage_id: newStageId })
    addActivity.mutate({
      orderId,
      activityType: 'stage_change',
      description: `Moved to ${stages?.find((s) => s.id === newStageId)?.name}`,
    })
  }

  const handleDelete = () => {
    confirmDelete({
      title: 'Delete this order?',
      description: 'This will permanently remove the order and its attachments.',
      onConfirm: async () => {
        await deleteOrder.mutateAsync(orderId)
        navigate('/orders')
      },
    })
  }

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activityText.trim()) return
    await addActivity.mutateAsync({
      orderId,
      activityType: 'note',
      description: activityText,
    })
    setActivityText('')
  }

  const formatDateInput = (date: string) => (date ? date.split('T')[0] : '')

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/orders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-mono">{order.order_number}</h1>
            <p className="text-muted-foreground">
              {order.client_id ? (
                <Link to={`/clients/${order.client_id}`} className="hover:underline">
                  {clientData.name || 'View client'}
                </Link>
              ) : (
                'No client linked'
              )}
            </p>
          </div>
        </div>
        <Button variant="destructive" onClick={handleDelete} disabled={deleteOrder.isPending}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Order Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm text-muted-foreground">Status</Label>
              <Select value={order.status_id || ''} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <Badge style={{ backgroundColor: s.color ?? undefined, color: 'white' }}>
                        {s.name}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Stage</Label>
              <Select value={order.stage_id || ''} onValueChange={handleStageChange}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      <Badge style={{ backgroundColor: s.color ?? undefined, color: 'white' }}>
                        {s.name}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Delivery Address
              </Label>
              <Textarea
                className="mt-2 min-h-20 resize-y"
                rows={3}
                value={orderData.delivery_address}
                onChange={(e) => setOrderData((p) => ({ ...p, delivery_address: e.target.value }))}
                onBlur={(e) => handleOrderFieldUpdate('delivery_address', e.target.value || null)}
              />
            </div>

            <div>
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Start Date
              </Label>
              <Input
                type="date"
                className="mt-2"
                value={formatDateInput(orderData.start_date)}
                onChange={(e) => setOrderData((p) => ({ ...p, start_date: e.target.value }))}
                onBlur={(e) => handleOrderFieldUpdate('start_date', e.target.value || null)}
              />
            </div>

            <div>
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                End Date
              </Label>
              <Input
                type="date"
                className="mt-2"
                value={formatDateInput(orderData.end_date)}
                onChange={(e) => setOrderData((p) => ({ ...p, end_date: e.target.value }))}
                onBlur={(e) => handleOrderFieldUpdate('end_date', e.target.value || null)}
              />
            </div>

            <div>
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Method of Contact
              </Label>
              <Input
                className="mt-2"
                value={orderData.method_of_contact}
                onChange={(e) => setOrderData((p) => ({ ...p, method_of_contact: e.target.value }))}
                onBlur={(e) => handleOrderFieldUpdate('method_of_contact', e.target.value || null)}
              />
            </div>

            <div>
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Deposit
              </Label>
              <Input
                type="number"
                className="mt-2"
                value={orderData.deposit}
                onChange={(e) => setOrderData((p) => ({ ...p, deposit: Number(e.target.value) }))}
                onBlur={(e) => handleOrderFieldUpdate('deposit', Number(e.target.value) || null)}
              />
            </div>

            <div>
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total Cost
              </Label>
              <Input
                type="number"
                className="mt-2"
                value={orderData.total_cost}
                onChange={(e) => setOrderData((p) => ({ ...p, total_cost: Number(e.target.value) }))}
                onBlur={(e) => handleOrderFieldUpdate('total_cost', Number(e.target.value) || null)}
              />
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Shipping Price</Label>
              <Input
                type="number"
                className="mt-2"
                value={orderData.shipping_price}
                onChange={(e) =>
                  setOrderData((p) => ({ ...p, shipping_price: Number(e.target.value) }))
                }
                onBlur={(e) =>
                  handleOrderFieldUpdate('shipping_price', Number(e.target.value) || null)
                }
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <Checkbox
                  checked={orderData.shipping_included_in_total}
                  onCheckedChange={(checked) => {
                    const value = checked === true
                    setOrderData((p) => ({ ...p, shipping_included_in_total: value }))
                    handleOrderFieldUpdate('shipping_included_in_total', value)
                  }}
                />
                <span className="text-sm">Shipping included in total</span>
              </label>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <Label className="text-sm text-muted-foreground">Description</Label>
            <Textarea
              className="mt-2"
              rows={4}
              value={orderData.description}
              onChange={(e) => setOrderData((p) => ({ ...p, description: e.target.value }))}
              onBlur={(e) => handleOrderFieldUpdate('description', e.target.value || null)}
            />
          </div>

          <div className="mt-4">
            <Label className="text-sm text-muted-foreground">Notes</Label>
            <Textarea
              className="mt-2"
              rows={4}
              value={orderData.notes}
              onChange={(e) => setOrderData((p) => ({ ...p, notes: e.target.value }))}
              onBlur={(e) => handleOrderFieldUpdate('notes', e.target.value || null)}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              Client Details
            </h2>
            {order.client_id && (
              <Link to={`/clients/${order.client_id}`}>
                <Button variant="outline" size="sm">
                  View profile
                </Button>
              </Link>
            )}
          </div>

          {order.client_id ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <Label className="text-sm text-muted-foreground">Name</Label>
                <Input
                  className="mt-2"
                  value={clientData.name}
                  onChange={(e) => setClientData((p) => ({ ...p, name: e.target.value }))}
                  onBlur={(e) => handleClientFieldUpdate('name', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </Label>
                <Input
                  className="mt-2"
                  value={clientData.phone}
                  onChange={(e) => setClientData((p) => ({ ...p, phone: e.target.value }))}
                  onBlur={(e) => handleClientFieldUpdate('phone', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone 2
                </Label>
                <Input
                  className="mt-2"
                  value={clientData.phone_2}
                  onChange={(e) => setClientData((p) => ({ ...p, phone_2: e.target.value }))}
                  onBlur={(e) => handleClientFieldUpdate('phone_2', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </Label>
                <Textarea
                  className="mt-2"
                  rows={3}
                  value={clientData.address}
                  onChange={(e) => setClientData((p) => ({ ...p, address: e.target.value }))}
                  onBlur={(e) => handleClientFieldUpdate('address', e.target.value)}
                />
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No client linked to this order.</p>
          )}
        </Card>
      </div>

      <div className="space-y-6">

          <AttachmentForm />

          {order.attachments?.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Attachments</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {order.attachments.map((att) => (
                  <AttachmentItem key={att.id} attachment={att} orderId={orderId} />
                ))}
              </div>
            </Card>
          )}

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Activity Timeline</h2>
          <form onSubmit={handleAddActivity} className="mb-6">
            <div className="flex gap-2">
              <Input
                placeholder="Add a note..."
                value={activityText}
                onChange={(e) => setActivityText(e.target.value)}
              />
              <Button type="submit" disabled={!activityText.trim() || addActivity.isPending}>
                {addActivity.isPending && <Loader2 className="animate-spin" />}
                {addActivity.isPending ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </form>
          <div className="space-y-4">
            {order.activities?.length ? (
              order.activities.map((activity) => (
                <div key={activity.id} className="pb-4 border-b border-border last:border-0">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{activity.activity_type}</p>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {activity.created_at
                          ? new Date(activity.created_at).toLocaleString()
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No activities yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
