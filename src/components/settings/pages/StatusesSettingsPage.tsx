import {
  useStatuses,
  useCreateStatus,
  useUpdateStatus,
  useDeleteStatus,
} from '@/lib/hooks/useReferenceData'
import { Card } from '@/components/ui/card'
import ReferenceDataTab from '@/components/settings/ReferenceDataTab'

export default function StatusesSettingsPage() {
  const { data: statuses = [] } = useStatuses()
  const createStatus = useCreateStatus()
  const updateStatus = useUpdateStatus()
  const deleteStatus = useDeleteStatus()

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-4">Statuses</h2>
      <ReferenceDataTab
        title="Status"
        items={statuses}
        onCreate={async (data) => {
          await createStatus.mutateAsync({
            name: data.name as string,
            color: (data.color as string) || null,
            position: (data.position as number) ?? null,
          })
        }}
        onUpdate={async (id, data) => {
          await updateStatus.mutateAsync({
            id,
            name: data.name as string,
            color: (data.color as string) || null,
            position: (data.position as number) ?? null,
          })
        }}
        onDelete={async (id) => {
          await deleteStatus.mutateAsync(id)
        }}
      />
    </Card>
  )
}
