import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useDeleteConfirmStore } from '@/lib/store/deleteConfirmStore'
import { Loader2 } from 'lucide-react'

export default function DeleteConfirmDialog() {
  const open = useDeleteConfirmStore((s) => s.open)
  const isPending = useDeleteConfirmStore((s) => s.isPending)
  const title = useDeleteConfirmStore((s) => s.title)
  const description = useDeleteConfirmStore((s) => s.description)
  const confirmLabel = useDeleteConfirmStore((s) => s.confirmLabel)
  const setOpen = useDeleteConfirmStore((s) => s.setOpen)
  const confirm = useDeleteConfirmStore((s) => s.confirm)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => void confirm()}
            disabled={isPending}
          >
            {isPending && <Loader2 className="animate-spin" />}
            {isPending ? 'Deleting…' : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
