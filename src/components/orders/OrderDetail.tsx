import { Link, useNavigate } from 'react-router-dom'
import {
  useOrder,
  useUpdateOrder,
  useDeleteOrder,
  useAddActivity,
} from '@/lib/hooks/useOrders'

import {
  useStatuses,
  useStages,
} from '@/lib/hooks/useReferenceData'

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
} from 'lucide-react'

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

interface OrderDetailProps {
  orderId: string
}

export default function OrderDetail({
  orderId,
}: OrderDetailProps) {
  const navigate = useNavigate()

  const { data: order, isLoading } =
    useOrder(orderId)

  const { data: statuses } =
    useStatuses()

  const { data: stages } =
    useStages()

  const updateOrder =
    useUpdateOrder()

  const deleteOrder =
    useDeleteOrder()

  const addActivity =
    useAddActivity()

  const [activityText, setActivityText] =
    useState('')

  const [formData, setFormData] =
    useState({
      customer_name: '',
      customer_phone: '',
      customer_phone_2: '',
      description: '',
      notes: '',
      deposit: 0,
      total_cost: 0,
      end_date: '',
    })

  useEffect(() => {
    if (order) {
      setFormData({
        customer_name:
          order.customer_name || '',
        customer_phone:
          order.customer_phone || '',
        customer_phone_2:
          order.customer_phone_2 || '',
        description:
          order.description || '',
        notes: order.notes || '',
        deposit: order.deposit || 0,
        total_cost:
          order.total_cost || 0,
        end_date:
          order.end_date || '',
      })
    }
  }, [order])

  const handleFieldUpdate = async (
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    await updateOrder.mutateAsync({
      id: orderId,
      [field]: value,
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
          <p className="text-muted-foreground mb-4">
            Order not found
          </p>

          <Link to="/orders">
            <Button>
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleStatusChange = async (
    newStatusId: string
  ) => {
    await updateOrder.mutateAsync({
      id: orderId,
      status_id: newStatusId,
    })

    addActivity.mutate({
      orderId,
      activityType:
        'status_change',
      description: `Status changed to ${statuses?.find(
        (s) =>
          s.id === newStatusId
      )?.name
        }`,
    })
  }

  const handleStageChange = async (
    newStageId: string
  ) => {
    await updateOrder.mutateAsync({
      id: orderId,
      stage_id: newStageId,
    })

    addActivity.mutate({
      orderId,
      activityType:
        'stage_change',
      description: `Moved to ${stages?.find(
        (s) =>
          s.id === newStageId
      )?.name
        }`,
    })
  }

  const handleDelete = async () => {
    if (
      confirm(
        'Are you sure you want to delete this order?'
      )
    ) {
      await deleteOrder.mutateAsync(
        orderId
      )

      navigate('/orders')
    }
  }

  const handleAddActivity = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    if (!activityText.trim())
      return

    await addActivity.mutateAsync({
      orderId,
      activityType: 'note',
      description: activityText,
    })

    setActivityText('')
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/orders">
            <Button
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>

          <div>
            <h1 className="text-3xl font-bold font-mono">
              {order.order_number}
            </h1>

            <p className="text-muted-foreground">
              {
                formData.customer_name
              }
            </p>
          </div>
        </div>

        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={
            deleteOrder.isPending
          }
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Order Information
            </h2>

            <div className="grid grid-cols-2 gap-6">
              {/* STATUS */}
              <div>
                <Label className="text-sm text-muted-foreground">
                  Status
                </Label>

                <Select
                  value={
                    order.status_id ||
                    ''
                  }
                  onValueChange={
                    handleStatusChange
                  }
                >
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent>
                    {statuses?.map(
                      (s) => (
                        <SelectItem
                          key={s.id}
                          value={s.id}
                        >
                          <Badge
                            style={{
                              backgroundColor: s.color,
                              color: "white"
                            }}
                          >
                            {s.name}
                          </Badge>
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* STAGE */}
              <div>
                <Label className="text-sm text-muted-foreground">
                  Stage
                </Label>

                <Select
                  value={
                    order.stage_id ||
                    ''
                  }
                  onValueChange={
                    handleStageChange
                  }
                >
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>

                  <SelectContent>
                    {stages?.map(
                      (s) => (
                        <SelectItem
                          key={s.id}
                          value={s.id}
                        >
                          <Badge
                            style={{
                              backgroundColor:
                                s.color,
                              color: "white"
                            }}
                          >
                            {s.name}
                          </Badge>
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* CUSTOMER */}
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer
                </Label>

                <Input
                  className="mt-2"
                  value={
                    formData.customer_name
                  }
                  onChange={(e) =>
                    setFormData(
                      (
                        prev
                      ) => ({
                        ...prev,
                        customer_name:
                          e.target
                            .value,
                      })
                    )
                  }
                  onBlur={(e) =>
                    handleFieldUpdate(
                      'customer_name',
                      e.target.value
                    )
                  }
                />
              </div>

              {/* PHONE */}
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </Label>

                <Input
                  className="mt-2"
                  value={
                    formData.customer_phone
                  }
                  onChange={(e) =>
                    setFormData(
                      (
                        prev
                      ) => ({
                        ...prev,
                        customer_phone:
                          e.target
                            .value,
                      })
                    )
                  }
                  onBlur={(e) =>
                    handleFieldUpdate(
                      'customer_phone',
                      e.target.value
                    )
                  }
                />
              </div>

              {/* PHONE 2 */}
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone 2
                </Label>

                <Input
                  className="mt-2"
                  value={
                    formData.customer_phone_2
                  }
                  onChange={(e) =>
                    setFormData(
                      (
                        prev
                      ) => ({
                        ...prev,
                        customer_phone_2:
                          e.target
                            .value,
                      })
                    )
                  }
                  onBlur={(e) =>
                    handleFieldUpdate(
                      'customer_phone_2',
                      e.target.value
                    )
                  }
                />
              </div>

              {/* END DATE */}
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  End Date
                </Label>

                <Input
                  type="date"
                  className="mt-2"
                  value={
                    formData.end_date
                      ? formData.end_date.split(
                        'T'
                      )[0]
                      : ''
                  }
                  onChange={(e) =>
                    setFormData(
                      (
                        prev
                      ) => ({
                        ...prev,
                        end_date:
                          e.target
                            .value,
                      })
                    )
                  }
                  onBlur={(e) =>
                    handleFieldUpdate(
                      'end_date',
                      e.target.value
                    )
                  }
                />
              </div>

              {/* DEPOSIT */}
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Deposit
                </Label>

                <Input
                  type="number"
                  className="mt-2"
                  value={
                    formData.deposit
                  }
                  onChange={(e) =>
                    setFormData(
                      (
                        prev
                      ) => ({
                        ...prev,
                        deposit:
                          Number(
                            e
                              .target
                              .value
                          ),
                      })
                    )
                  }
                  onBlur={(e) =>
                    handleFieldUpdate(
                      'deposit',
                      Number(
                        e.target
                          .value
                      )
                    )
                  }
                />
              </div>

              {/* TOTAL COST */}
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Total Cost
                </Label>

                <Input
                  type="number"
                  className="mt-2"
                  value={
                    formData.total_cost
                  }
                  onChange={(e) =>
                    setFormData(
                      (
                        prev
                      ) => ({
                        ...prev,
                        total_cost:
                          Number(
                            e
                              .target
                              .value
                          ),
                      })
                    )
                  }
                  onBlur={(e) =>
                    handleFieldUpdate(
                      'total_cost',
                      Number(
                        e.target
                          .value
                      )
                    )
                  }
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-6 pt-6 border-t border-border">
              <Label className="text-sm text-muted-foreground">
                Description
              </Label>

              <Textarea
                className="mt-2"
                rows={4}
                value={
                  formData.description
                }
                onChange={(e) =>
                  setFormData(
                    (
                      prev
                    ) => ({
                      ...prev,
                      description:
                        e.target
                          .value,
                    })
                  )
                }
                onBlur={(e) =>
                  handleFieldUpdate(
                    'description',
                    e.target.value
                  )
                }
              />
            </div>

            {/* NOTES */}
            <div className="mt-4">
              <Label className="text-sm text-muted-foreground">
                Notes
              </Label>

              <Textarea
                className="mt-2"
                rows={4}
                value={formData.notes}
                onChange={(e) =>
                  setFormData(
                    (
                      prev
                    ) => ({
                      ...prev,
                      notes:
                        e.target
                          .value,
                    })
                  )
                }
                onBlur={(e) =>
                  handleFieldUpdate(
                    'notes',
                    e.target.value
                  )
                }
              />
            </div>
          </Card>

          {/* ATTACHMENT FORM */}
          <AttachmentForm />

          {/* ATTACHMENTS */}
          {order.attachments
            ?.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-3">
                  Attachments
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {order.attachments.map(
                    (att: any) => (
                      <a
                        key={att.id}
                        href={
                          att.file_path
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={
                            att.file_path
                          }
                          alt={
                            att.file_name
                          }
                          className="w-full h-48 object-cover rounded-lg border hover:opacity-80 transition"
                        />
                      </a>
                    )
                  )}
                </div>
              </Card>
            )}

          {/* ACTIVITIES */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Activity Timeline
            </h2>

            <form
              onSubmit={
                handleAddActivity
              }
              className="mb-6"
            >
              <div className="flex gap-2">
                <Input
                  placeholder="Add a note..."
                  value={
                    activityText
                  }
                  onChange={(e) =>
                    setActivityText(
                      e.target.value
                    )
                  }
                />

                <Button
                  type="submit"
                  disabled={
                    !activityText.trim() ||
                    addActivity.isPending
                  }
                >
                  Add
                </Button>
              </div>
            </form>

            <div className="space-y-4">
              {order.activities
                ?.length ? (
                order.activities.map(
                  (
                    activity: any
                  ) => (
                    <div
                      key={
                        activity.id
                      }
                      className="pb-4 border-b border-border last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />

                        <div className="flex-1">
                          <p className="font-semibold text-sm">
                            {
                              activity.activity_type
                            }
                          </p>

                          <p className="text-sm text-muted-foreground mt-1">
                            {
                              activity.description
                            }
                          </p>

                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(
                              activity.created_at
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )
              ) : (
                <p className="text-center text-muted-foreground">
                  No activities
                  yet
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}