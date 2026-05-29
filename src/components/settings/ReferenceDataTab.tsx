import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDeleteConfirm } from '@/lib/hooks/useDeleteConfirm'
import { Pencil, Plus, Trash2, Loader2 } from 'lucide-react'

export interface ReferenceItem {
  id: string
  name: string
  color?: string | null
  position?: number | null
  description?: string | null
}

interface ReferenceDataTabProps {
  title: string
  items: ReferenceItem[]
  onCreate: (data: Record<string, unknown>) => Promise<void>
  onUpdate: (id: string, data: Record<string, unknown>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  showDescription?: boolean
  showPosition?: boolean
}

export default function ReferenceDataTab({
  title,
  items,
  onCreate,
  onUpdate,
  onDelete,
  showDescription = false,
  showPosition = true,
}: ReferenceDataTabProps) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ReferenceItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { confirmDelete } = useDeleteConfirm()
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: '', color: '#3B82F6', position: 0, description: '' },
  })

  const openCreate = () => {
    setEditing(null)
    reset({ name: '', color: '#3B82F6', position: items.length, description: '' })
    setOpen(true)
  }

  const openEdit = (item: ReferenceItem) => {
    setEditing(item)
    reset({
      name: item.name,
      color: item.color || '#3B82F6',
      position: item.position ?? 0,
      description: item.description || '',
    })
    setOpen(true)
  }

  const onSubmit = async (values: {
    name: string
    color: string
    position: number
    description: string
  }) => {
    setIsSubmitting(true)
    try {
      const payload: Record<string, unknown> = {
        name: values.name,
        color: values.color,
      }
      if (showPosition) payload.position = Number(values.position)
      if (showDescription) payload.description = values.description || null

      if (editing) {
        await onUpdate(editing.id, payload)
      } else {
        await onCreate(payload)
      }
      setOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (id: string, name: string) => {
    confirmDelete({
      itemName: name,
      onConfirm: () => onDelete(id),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Color</TableHead>
            {showPosition && <TableHead>Position</TableHead>}
            {showDescription && <TableHead>Description</TableHead>}
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>
                <span
                  className="inline-block w-6 h-6 rounded border"
                  style={{ backgroundColor: item.color || '#3B82F6' }}
                />
              </TableCell>
              {showPosition && <TableCell>{item.position ?? '—'}</TableCell>}
              {showDescription && (
                <TableCell className="max-w-xs truncate">{item.description || '—'}</TableCell>
              )}
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id, item.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${title}` : `Add ${title}`}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input {...register('name', { required: true })} className="mt-1" />
            </div>
            <div>
              <Label>Color</Label>
              <Input type="color" {...register('color')} className="mt-1 h-10 w-20" />
            </div>
            {showPosition && (
              <div>
                <Label>Position</Label>
                <Input type="number" {...register('position')} className="mt-1" />
              </div>
            )}
            {showDescription && (
              <div>
                <Label>Description</Label>
                <Input {...register('description')} className="mt-1" />
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="animate-spin" />}
                {isSubmitting
                  ? editing
                    ? 'Saving...'
                    : 'Creating...'
                  : editing
                    ? 'Save'
                    : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
