import {
  useStages,
  useCreateStage,
  useUpdateStage,
  useDeleteStage,
} from '@/lib/hooks/useReferenceData'
import { Card } from '@/components/ui/card'
import ReferenceDataTab from '@/components/settings/ReferenceDataTab'

export default function StagesSettingsPage() {
  const { data: stages = [] } = useStages()
  const createStage = useCreateStage()
  const updateStage = useUpdateStage()
  const deleteStage = useDeleteStage()

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-4">Stages</h2>
      <ReferenceDataTab
        title="Stage"
        items={stages}
        showDescription
        onCreate={async (data) => {
          await createStage.mutateAsync({
            name: data.name as string,
            color: (data.color as string) || null,
            position: (data.position as number) ?? null,
            description: (data.description as string) || null,
          })
        }}
        onUpdate={async (id, data) => {
          await updateStage.mutateAsync({
            id,
            name: data.name as string,
            color: (data.color as string) || null,
            position: (data.position as number) ?? null,
            description: (data.description as string) || null,
          })
        }}
        onDelete={async (id) => {
          await deleteStage.mutateAsync(id)
        }}
      />
    </Card>
  )
}
