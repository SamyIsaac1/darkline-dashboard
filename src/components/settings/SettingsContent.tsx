import { useSearchParams } from 'react-router-dom'
import { User, Layers, CircleDot, Tags } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import ProfileSettingsPage from '@/components/settings/pages/ProfileSettingsPage'
import StagesSettingsPage from '@/components/settings/pages/StagesSettingsPage'
import StatusesSettingsPage from '@/components/settings/pages/StatusesSettingsPage'
import TagsSettingsPage from '@/components/settings/pages/TagsSettingsPage'
import { SETTINGS_TABS, isSettingsTab, type SettingsTab } from '@/components/settings/settingsTabs'

const tabIcons: Record<SettingsTab, typeof User> = {
  profile: User,
  stages: Layers,
  statuses: CircleDot,
  tags: Tags,
}

export default function SettingsContent() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const tab: SettingsTab = isSettingsTab(tabParam) ? tabParam : 'profile'

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value }, { replace: true })
  }

  return (
    <div className="flex flex-col p-4 md:p-6">
      <h1 className="mb-4 shrink-0 text-2xl font-bold md:mb-6 md:text-3xl">Settings</h1>

      <Tabs
        value={tab}
        onValueChange={handleTabChange}
        orientation="vertical"
        className="flex min-h-0 flex-1 flex-col gap-4 md:flex-row"
      >
        <TabsList className="h-auto space-y-2 w-full shrink-0 flex-row overflow-x-auto bg-muted/50 p-1 md:h-full md:w-52 md:flex-col md:items-stretch md:overflow-visible">
          {SETTINGS_TABS.map((item) => {
            const Icon = tabIcons[item.value]
            return (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className={cn(
                  'shrink-0 justify-center gap-2 px-3 py-2 md:w-full md:justify-start',
                  'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <TabsContent value="profile" className="mt-0 h-full">
            <ProfileSettingsPage />
          </TabsContent>
          <TabsContent value="stages" className="mt-0 h-full">
            <StagesSettingsPage />
          </TabsContent>
          <TabsContent value="statuses" className="mt-0 h-full">
            <StatusesSettingsPage />
          </TabsContent>
          <TabsContent value="tags" className="mt-0 h-full">
            <TagsSettingsPage />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
