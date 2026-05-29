import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUIStore } from '@/lib/store/uiStore'
import { useCreateOrder } from '@/lib/hooks/useOrders'
import { useClients, useCreateClient } from '@/lib/hooks/useClients'
import { toast } from 'sonner'
import { useStatuses, useStages } from '@/lib/hooks/useReferenceData'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import CustomInput from '../shared/custom-input'
import type { Stage, Status } from '@/types/collection'

const orderFormSchema = z.object({
  order_number: z.string().min(1),
  client_mode: z.enum(['existing', 'new']),
  client_id: z.string().optional(),
  client_name: z.string().optional(),
  client_phone: z.string().optional(),
  client_phone_2: z.string().optional(),
  client_address: z.string().optional(),
  description: z.string().optional(),
  delivery_address: z.string().optional(),
  status_id: z.string().optional(),
  stage_id: z.string().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  deposit: z.number().nullable().optional(),
  total_cost: z.number().nullable().optional(),
  method_of_contact: z.string().optional(),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.client_mode === 'existing' && !data.client_id) {
    ctx.addIssue({ code: 'custom', message: 'Select a client', path: ['client_id'] })
  }
  if (data.client_mode === 'new' && !data.client_name?.trim()) {
    ctx.addIssue({ code: 'custom', message: 'Client name is required', path: ['client_name'] })
  }
})

type OrderFormValues = z.infer<typeof orderFormSchema>

export default function OrderModal() {
  const { isOrderModalOpen, setOrderModalOpen } = useUIStore()
  const createOrder = useCreateOrder()
  const createClient = useCreateClient()
  const { data: clients = [] } = useClients()
  const { data: statuses = [] } = useStatuses()
  const { data: stages = [] } = useStages()

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      order_number: '',
      client_mode: 'new',
      client_id: '',
      client_name: '',
      client_phone: '',
      client_phone_2: '',
      client_address: '',
      description: '',
      delivery_address: '',
      status_id: '',
      stage_id: '',
      start_date: null,
      end_date: null,
      deposit: null,
      total_cost: null,
      method_of_contact: '',
      notes: '',
    },
  })

  const clientMode = form.watch('client_mode')

  useEffect(() => {
    if (isOrderModalOpen) {
      form.reset({
        order_number: `ORD-${Date.now()}`,
        client_mode: 'new',
        client_id: '',
        client_name: '',
        client_phone: '',
        client_phone_2: '',
        client_address: '',
        description: '',
        delivery_address: '',
        status_id: statuses?.[0]?.id ?? '',
        stage_id: stages?.[0]?.id ?? '',
        start_date: null,
        end_date: null,
        deposit: null,
        total_cost: null,
        method_of_contact: '',
        notes: '',
      })
    }
  }, [isOrderModalOpen, form, statuses, stages])

  const isSubmitting = createClient.isPending || createOrder.isPending

  const onSubmit = async (values: OrderFormValues) => {
    try {
      let clientId: string | null = null

      if (values.client_mode === 'new') {
        const client = await createClient.mutateAsync({
          name: values.client_name!.trim(),
          phone: values.client_phone || null,
          phone_2: values.client_phone_2 || null,
          address: values.client_address || null,
        })
        clientId = client.id
      } else {
        clientId = values.client_id ?? null
      }

      await createOrder.mutateAsync({
        order_number: values.order_number,
        description: values.description || null,
        delivery_address: values.delivery_address || null,
        status_id: values.status_id || null,
        stage_id: values.stage_id || null,
        start_date: values.start_date?.trim() || null,
        end_date: values.end_date?.trim() || null,
        deposit: values.deposit ?? null,
        total_cost: values.total_cost ?? null,
        method_of_contact: values.method_of_contact || null,
        notes: values.notes || null,
        client_id: clientId,
      })

      toast.success('Order created')
      setOrderModalOpen(false)
      form.reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create order')
      console.error(error)
    }
  }

  return (
    <Dialog open={isOrderModalOpen} onOpenChange={setOrderModalOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Order</DialogTitle>
          <DialogDescription>Fill in the details below to create a new order.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="client_mode"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Client</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">New client</SelectItem>
                        <SelectItem value="existing">Existing client</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {clientMode === 'existing' ? (
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Select Client</FormLabel>
                      <Select value={field.value || ''} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name || 'Unnamed'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <>
                  <div className="md:col-span-2">
                    <CustomInput<OrderFormValues>
                      control={form.control}
                      name="client_name"
                      label="Client Name"
                    />
                  </div>
                  <CustomInput<OrderFormValues>
                    control={form.control}
                    name="client_phone"
                    label="Phone"
                    type="tel"
                  />
                  <CustomInput<OrderFormValues>
                    control={form.control}
                    name="client_phone_2"
                    label="Phone 2"
                    type="tel"
                  />
                  <div className="md:col-span-2">
                    <CustomInput<OrderFormValues>
                      control={form.control}
                      name="client_address"
                      label="Address"
                    />
                  </div>
                </>
              )}

              <FormField
                control={form.control}
                name="status_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses.map((status: Status) => (
                          <SelectItem key={status.id} value={status.id}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stage_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage</FormLabel>
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {stages.map((stage: Stage) => (
                          <SelectItem key={stage.id} value={stage.id}>
                            {stage.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CustomInput<OrderFormValues> control={form.control} name="deposit" label="Deposit" type="number" />
              <CustomInput<OrderFormValues> control={form.control} name="total_cost" label="Total Cost" type="number" />
              <CustomInput<OrderFormValues> control={form.control} name="method_of_contact" label="Method Of Contact" />
              <CustomInput<OrderFormValues> control={form.control} name="start_date" label="Start Date" type="date" />
              <CustomInput<OrderFormValues> control={form.control} name="end_date" label="End Date" type="date" />
              <div className="md:col-span-2">
                <CustomInput<OrderFormValues> control={form.control} name="delivery_address" label="Delivery Address" />
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} value={field.value || ''} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea rows={3} value={field.value || ''} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOrderModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {createClient.isPending
                  ? 'Creating client...'
                  : createOrder.isPending
                    ? 'Creating order...'
                    : 'Create Order'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
