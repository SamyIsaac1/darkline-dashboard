import type { ReactNode } from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'
import {
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
import { cn } from '@/lib/utils'

export type SelectOption = {
  value: string
  label: ReactNode
}

type CustomSelectProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  options: SelectOption[]
  placeholder?: string
  className?: string
}

export default function CustomSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  className,
}: CustomSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <FormLabel>{label}</FormLabel>
          <Select
            value={field.value ?? ''}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
