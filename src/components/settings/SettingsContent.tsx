import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useProfile, useUpdateProfile } from '@/lib/hooks/useProfile'
import {
  useStatuses,
  useStages,
  useTags,
  useCreateStatus,
  useUpdateStatus,
  useDeleteStatus,
  useCreateStage,
  useUpdateStage,
  useDeleteStage,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
} from '@/lib/hooks/useReferenceData'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import ReferenceDataTab from './ReferenceDataTab'
import { toast } from 'sonner'

export default function SettingsContent() {
  const { data: profile, isLoading: profileLoading } = useProfile()
  const updateProfile = useUpdateProfile()
  const { data: statuses = [] } = useStatuses()
  const { data: stages = [] } = useStages()
  const { data: tags = [] } = useTags()

  const createStatus = useCreateStatus()
  const updateStatus = useUpdateStatus()
  const deleteStatus = useDeleteStatus()
  const createStage = useCreateStage()
  const updateStage = useUpdateStage()
  const deleteStage = useDeleteStage()
  const createTag = useCreateTag()
  const updateTag = useUpdateTag()
  const deleteTag = useDeleteTag()

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { company_name: '', email: '' },
  })

  useEffect(() => {
    if (profile) {
      reset({
        company_name: profile.company_name,
        email: profile.email,
      })
    }
  }, [profile, reset])

  const onProfileSubmit = async (values: { company_name: string }) => {
    try {
      await updateProfile.mutateAsync({ company_name: values.company_name })
      toast.success('Profile updated')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Update failed')
    }
  }

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="stages">Stages</TabsTrigger>
          <TabsTrigger value="statuses">Statuses</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="p-6 max-w-lg">
            <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
              <div>
                <Label>Company Name</Label>
                <Input {...register('company_name', { required: true })} className="mt-1" />
              </div>
              <div>
                <Label>Email</Label>
                <Input {...register('email')} className="mt-1" disabled />
              </div>
              <Button type="submit" disabled={updateProfile.isPending}>
                Save Profile
              </Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="stages" className="mt-6">
          <Card className="p-6">
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
        </TabsContent>

        <TabsContent value="statuses" className="mt-6">
          <Card className="p-6">
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
        </TabsContent>

        <TabsContent value="tags" className="mt-6">
          <Card className="p-6">
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
