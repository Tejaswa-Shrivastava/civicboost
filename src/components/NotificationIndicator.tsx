import { Bell, BellSlash } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { useNotifications } from '@/hooks/useNotifications'

export function NotificationIndicator() {
  const { settings } = useNotifications()

  if (!settings.enabled) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <BellSlash className="w-4 h-4" />
        <span className="text-xs hidden sm:inline">Notifications Off</span>
      </div>
    )
  }

  const activeCount = [
    settings.statusUpdates,
    settings.nearbyIssues,
    settings.achievements
  ].filter(Boolean).length

  return (
    <div className="flex items-center gap-2 text-primary">
      <Bell className="w-4 h-4" />
      <span className="text-xs hidden sm:inline">Notifications On</span>
      <Badge variant="secondary" className="text-xs">
        {activeCount}/3
      </Badge>
    </div>
  )
}