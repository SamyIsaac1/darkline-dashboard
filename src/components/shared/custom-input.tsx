import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { FieldValues, Path, useFormContext } from 'react-hook-form'

type CustomInputProps<T extends FieldValues> = {
  name: Path<T>
  label: string
  type?: string
  placeholder?: string
}

export default function CustomInput<T extends FieldValues>({
  name,
  label,
  type = 'text',
  placeholder,
}: CustomInputProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              {...(type === 'number'
                ? {
                    value: field.value ?? '',
                    onChange: (e) => {
                      const raw = e.target.value.replace(/[^0-9.]/g, '')
                      field.onChange(raw === '' ? null : Number(raw))
                    },
                    onWheel: (e: React.WheelEvent<HTMLInputElement>) => {
                      e.currentTarget.blur()
                    },
                  }
                : type === 'date'
                  ? {
                      value: field.value ?? '',
                      onChange: (e) => field.onChange(e.target.value || null),
                    }
                  : {})}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
