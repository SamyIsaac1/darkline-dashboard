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
import { Checkbox } from '@/components/ui/checkbox'
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
} from '@/components/ui/form'
import CustomInput from '../shared/custom-input'
import CustomSelect from '../shared/custom-select'
import CustomTextarea from '../shared/custom-textarea'

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
  same_as_client_address: z.boolean().optional(),
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
      same_as_client_address: false,
    },
  })

  const clientMode = form.watch('client_mode')
  const sameAsClientAddress = form.watch('same_as_client_address')
  const clientAddress = form.watch('client_address')
  const clientId = form.watch('client_id')

  const resolvedClientAddress =
    clientMode === 'new'
      ? clientAddress ?? ''
      : clients.find((client) => client.id === clientId)?.address ?? ''

  useEffect(() => {
    if (sameAsClientAddress) {
      form.setValue('delivery_address', resolvedClientAddress, { shouldDirty: true })
    }
  }, [sameAsClientAddress, resolvedClientAddress, form])

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
        same_as_client_address: false,
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
              <CustomSelect<OrderFormValues>
                name="client_mode"
                label="Client"
                placeholder="Select client type"
                className="md:col-span-2"
                options={[
                  { value: 'new', label: 'New client' },
                  { value: 'existing', label: 'Existing client' },
                ]}
              />

              {clientMode === 'existing' ? (
                <CustomSelect<OrderFormValues>
                  name="client_id"
                  label="Select Client"
                  placeholder="Choose a client"
                  className="md:col-span-2"
                  options={clients.map((client) => ({
                    value: client.id,
                    label: client.name || 'Unnamed',
                  }))}
                />
              ) : (
                <>
                  <div className="md:col-span-2">
                    <CustomInput<OrderFormValues>
                      name="client_name"
                      label="Client Name"
                      placeholder="Enter client name"
                    />
                  </div>
                  <CustomInput<OrderFormValues>
                    name="client_phone"
                    label="Phone"
                    type="tel"
                    placeholder="Primary phone number"
                  />
                  <CustomInput<OrderFormValues>
                    name="client_phone_2"
                    label="Phone 2"
                    type="tel"
                    placeholder="Secondary phone (optional)"
                  />
                  <div className="md:col-span-2">
                    <CustomInput<OrderFormValues>
                      name="client_address"
                      label="Address"
                      placeholder="Street address, city, zip"
                    />
                  </div>
                </>
              )}

              <CustomSelect<OrderFormValues>
                name="status_id"
                label="Status"
                placeholder="Select status"
                options={statuses.map((status) => ({
                  value: status.id,
                  label: status.name,
                }))}
              />

              <CustomSelect<OrderFormValues>
                name="stage_id"
                label="Stage"
                placeholder="Select stage"
                options={stages.map((stage) => ({
                  value: stage.id,
                  label: stage.name,
                }))}
              />

              <CustomInput<OrderFormValues>
                name="deposit"
                label="Deposit"
                type="number"
                placeholder="0.00"
              />
              <CustomInput<OrderFormValues>
                name="total_cost"
                label="Total Cost"
                type="number"
                placeholder="0.00"
              />
              <CustomInput<OrderFormValues>
                name="method_of_contact"
                label="Method Of Contact"
                placeholder="phone, Instagram, WhatsApp..."
              />
              <CustomInput<OrderFormValues>
                name="start_date"
                label="Start Date"
                type="date"
              />
              <CustomInput<OrderFormValues>
                name="end_date"
                label="End Date"
                type="date"
              />
            </div>

            <FormField
              name="same_as_client_address"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Same as client address</FormLabel>
                </FormItem>
              )}
            />

            <CustomTextarea<OrderFormValues>
              name="delivery_address"
              label="Delivery Address"
              placeholder="Enter delivery address"
              rows={3}
              className="min-h-20 resize-y"
              disabled={sameAsClientAddress}
            />

            <CustomTextarea<OrderFormValues>
              name="description"
              label="Description"
              placeholder="Order details, items, specifications..."
            />

            <CustomTextarea<OrderFormValues>
              name="notes"
              label="Notes"
              placeholder="Internal notes (optional)"
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
