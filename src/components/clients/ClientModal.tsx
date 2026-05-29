import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateClient, useUpdateClient } from '@/lib/hooks/useClients'
import type { Client } from '@/types/collection'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import CustomInput from '@/components/shared/custom-input'
import { Loader2 } from 'lucide-react'

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  phone_2: z.string().optional(),
  address: z.string().optional(),
})

type ClientFormValues = z.infer<typeof clientSchema>

interface ClientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: Client | null
}

export default function ClientModal({ open, onOpenChange, client }: ClientModalProps) {
  const createClient = useCreateClient()
  const updateClient = useUpdateClient()
  const isEditing = !!client

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: { name: '', phone: '', phone_2: '', address: '' },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: client?.name || '',
        phone: client?.phone || '',
        phone_2: client?.phone_2 || '',
        address: client?.address || '',
      })
    }
  }, [open, client, form])

  const isSubmitting = createClient.isPending || updateClient.isPending

  const onSubmit = async (values: ClientFormValues) => {
    try {
      if (isEditing && client) {
        await updateClient.mutateAsync({
          id: client.id,
          name: values.name,
          phone: values.phone || null,
          phone_2: values.phone_2 || null,
          address: values.address || null,
        })
      } else {
        await createClient.mutateAsync({
          name: values.name,
          phone: values.phone || null,
          phone_2: values.phone_2 || null,
          address: values.address || null,
        })
      }
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Client' : 'New Client'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomInput name="name" label="Name" />
            <CustomInput name="phone" label="Phone" type="tel" />
            <CustomInput name="phone_2" label="Phone 2" type="tel" />
            <CustomInput name="address" label="Address" />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="animate-spin" />}
                {isSubmitting
                  ? isEditing
                    ? 'Saving...'
                    : 'Creating...'
                  : isEditing
                    ? 'Save'
                    : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
