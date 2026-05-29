import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import {
  Control,
  FieldValues,
  Path,
} from 'react-hook-form'


type CustomInputProps<
  T extends FieldValues
> = {
  control: Control<T>
  name: Path<T>
  label: string
  type?: string
}

export default function CustomInput<
  T extends FieldValues
>({ control, name, label, type = 'text' }: CustomInputProps<T>) {
  return <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>
          {label}
        </FormLabel>

        <FormControl>
          <Input
            {...field}
            type={type}
            {...(type === 'number'
              ? {
                  value: field.value ?? '',
                  onChange: (e) => {
                    const raw = e.target.value.replace(/[^0-9.]/g, '')
                    field.onChange(raw === '' ? null : Number(raw))
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
}