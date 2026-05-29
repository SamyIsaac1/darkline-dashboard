import {
  useTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
} from '@/lib/hooks/useReferenceData'
import { Card } from '@/components/ui/card'
import ReferenceDataTab from '@/components/settings/ReferenceDataTab'

export default function TagsSettingsPage() {
  const { data: tags = [] } = useTags()
  const createTag = useCreateTag()
  const updateTag = useUpdateTag()
  const deleteTag = useDeleteTag()

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-4">Tags</h2>
      <ReferenceDataTab
        title="Tag"
        items={tags}
        showPosition={false}
        onCreate={async (data) => {
          await createTag.mutateAsync({
            name: data.name as string,
            color: (data.color as string) || null,
          })
        }}
        onUpdate={async (id, data) => {
          await updateTag.mutateAsync({
            id,
            name: data.name as string,
            color: (data.color as string) || null,
          })
        }}
        onDelete={async (id) => {
          await deleteTag.mutateAsync(id)
        }}
      />
    </Card>
  )
}
