import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useAddActivity } from '@/lib/hooks/useOrders'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

import CustomInput from '../shared/custom-input'
import { useAddAttachment } from '@/lib/hooks/useAttachments'
import { useParams } from 'react-router-dom'
import { Card } from '../ui/card'


const attachmentSchema = z.object({
  file_path: z.string().url(),
  file_name: z.string().optional(),
})

type AttachmentFormValues = z.infer<
  typeof attachmentSchema
>


export default function AttachmentForm() {
  const { id } = useParams()
  const addActivity = useAddActivity()
  const addAttachment = useAddAttachment()

  const form = useForm<AttachmentFormValues>({
    resolver: zodResolver(
      attachmentSchema
    ),

    defaultValues: {
      file_path: '',
      file_name: '',
    },
  })

  const onSubmit = async (
    values: AttachmentFormValues
  ) => {
    try {
      const fileName =
        values.file_name?.trim() ||
        values.file_path
          .split('/')
          .pop() ||
        'Attachment'

      await addAttachment.mutateAsync({
        file_name: fileName,
        file_path: values.file_path,
      })


      addActivity.mutate({
        orderId: id as string,
        activityType: 'attachment',
        description: `Added attachment: ${fileName}`,
      })

      form.reset()

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            onSubmit
          )}
          className="space-y-4"
        >
          <CustomInput<AttachmentFormValues>
            control={form.control}
            name="file_path"
            label="Image URL"
          />

          <CustomInput<AttachmentFormValues>
            control={form.control}
            name="file_name"
            label="File Name"
          />

          <Button
            type="submit"
            disabled={addAttachment.isPending}
          >
            {addAttachment.isPending ? 'Adding...' : 'Add Attachment'}
          </Button>
        </form>
      </Form>
    </Card>
  )
}