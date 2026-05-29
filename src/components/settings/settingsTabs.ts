export const SETTINGS_TABS = [
  { value: 'profile', label: 'Profile' },
  { value: 'stages', label: 'Stages' },
  { value: 'statuses', label: 'Statuses' },
  { value: 'tags', label: 'Tags' },
] as const

export type SettingsTab = (typeof SETTINGS_TABS)[number]['value']

export function isSettingsTab(value: string | null): value is SettingsTab {
  return SETTINGS_TABS.some((tab) => tab.value === value)
}
