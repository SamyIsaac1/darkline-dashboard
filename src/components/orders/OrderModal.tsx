import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useUIStore } from '@/lib/store/uiStore'
import { useCreateOrder } from '@/lib/hooks/useOrders'
import {
  useStatuses,
  useStages,
} from '@/lib/hooks/useReferenceData'

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
import { Stage, Status } from '@/types/collection'

const orderFormSchema = z.object({
  order_number: z.string().min(1),

  customer_name: z.string().min(1),

  customer_phone: z.string().optional(),

  customer_phone_2: z.string().optional(),

  description: z.string().optional(),

  status_id: z.string().optional(),

  stage_id: z.string().optional(),

  end_date: z.string().optional(),

  deposit: z.number().nullable().optional(),

  total_cost: z.number().nullable().optional(),

  method_of_contact: z.string().optional(),

  notes: z.string().optional(),
})

type OrderFormValues = z.infer<
  typeof orderFormSchema
>

export default function OrderModal() {
  const {
    isOrderModalOpen,
    setOrderModalOpen,
  } = useUIStore()

  const createOrder = useCreateOrder()

  const { data: statuses = [] } =
    useStatuses()

  const { data: stages = [] } =
    useStages()

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),

    defaultValues: {
      order_number: '',
      customer_name: '',
      customer_phone: '',
      customer_phone_2: '',
      description: '',
      status_id: statuses?.[0]?.id,
      stage_id: stages?.[0]?.id,
      end_date: '',
      deposit: null,
      total_cost: null,
      method_of_contact: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (isOrderModalOpen) {
      form.reset({
        order_number: `ORD-${Date.now()}`,
        customer_name: '',
        customer_phone: '',
        customer_phone_2: '',
        description: '',
        status_id: statuses?.[0]?.id,
        stage_id: stages?.[0]?.id,
        end_date: '',
        deposit: null,
        total_cost: null,
        method_of_contact: '',
        notes: '',
      })
    }
  }, [isOrderModalOpen, form])

  const onSubmit = async (
    values: OrderFormValues
  ) => {
    try {
      await createOrder.mutateAsync({
        order_number:
          values.order_number,

        customer_name:
          values.customer_name,

        customer_phone:
          values.customer_phone ||
          null,

        customer_phone_2:
          values.customer_phone_2 ||
          null,

        description:
          values.description || null,

        status_id:
          values.status_id || null,

        stage_id:
          values.stage_id || null,

        end_date:
          values.end_date || null,

        deposit:
          values.deposit ?? null,

        total_cost:
          values.total_cost ?? null,

        method_of_contact: values.method_of_contact || null,

        notes: values.notes || null,
      })

      setOrderModalOpen(false)

      form.reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog
      open={isOrderModalOpen}
      onOpenChange={setOrderModalOpen}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Order #{`ORD-${Date.now()}`}
          </DialogTitle>

          <DialogDescription>
            Fill in the details below
            to create a new order.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className="space-y-4"
          >
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* CUSTOMER NAME */}
              <div className="md:col-span-2">
                <CustomInput<OrderFormValues>
                  control={form.control}
                  name="customer_name"
                  label="Customer Name"
                />
              </div>

              {/* STATUS */}
              <FormField
                control={form.control}
                name="status_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status
                    </FormLabel>

                    <Select
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {statuses.map((status: Status) => (
                          <SelectItem
                            key={status.id}
                            value={String(status.id)}
                          >
                            {status.name}
                          </SelectItem>
                        )
                        )}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* STAGE */}
              <FormField
                control={form.control}
                name="stage_id"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>
                      Stage
                    </FormLabel>

                    <Select
                      value={field.value || ''}
                      onValueChange={
                        field.onChange
                      }
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {stages.map(
                          (
                            stage: Stage
                          ) => (
                            <SelectItem
                              key={stage.id}
                              value={String(stage.id)}
                            >
                              {stage.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PHONE */}
              <CustomInput<OrderFormValues>
                control={form.control}
                name="customer_phone"
                label="Phone"
                type='tel'
              />

              {/* PHONE 2 */}
              <CustomInput<OrderFormValues>
                control={form.control}
                name="customer_phone_2"
                label="Phone 2"
                type='tel'
              />

              {/* DEPOSIT */}
              <CustomInput<OrderFormValues>
                control={form.control}
                name="deposit"
                label="Deposit"
                type='number'
              />

              {/* TOTAL COST */}
              <CustomInput<OrderFormValues>
                control={form.control}
                name="total_cost"
                label="Total Cost"
                type='number'
              />
              {/* End DATE */}
              <CustomInput<OrderFormValues>
                control={form.control}
                name="method_of_contact"
                label="Method Of Contact"
              />
              {/* End DATE */}
              <CustomInput<OrderFormValues>
                control={form.control}
                name="end_date"
                label="end Date"
                type="date"
              />
            </div>

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      rows={3}
                      value={
                        field.value ||
                        ''
                      }
                      onChange={
                        field.onChange
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* NOTES */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Notes
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      rows={3}
                      value={field.value || ''}
                      onChange={
                        field.onChange
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setOrderModalOpen(
                    false
                  )
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  createOrder.isPending
                }
              >
                {createOrder.isPending
                  ? 'Creating...'
                  : 'Create Order'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  )
}