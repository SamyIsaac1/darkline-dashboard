import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Control, FieldValues, Path } from 'react-hook-form'

type CustomTextareaProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  rows?: number
  placeholder?: string
}

export default function CustomTextarea<T extends FieldValues>({
  control,
  name,
  label,
  rows = 3,
  placeholder,
}: CustomTextareaProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              rows={rows}
              placeholder={placeholder}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
