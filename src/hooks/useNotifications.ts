import { useKV } from '@github/spark/hooks'
import { notificationService } from '@/lib/notifications'
import type { NotificationSettings } from '@/components/NotificationCenter'

export function useNotifications() {
  const [settings] = useKV<NotificationSettings>('notification-settings', {
    statusUpdates: true,
    nearbyIssues: true,
    achievements: true,
    enabled: false
  })

  const canSendNotification = (type: keyof Omit<NotificationSettings, 'enabled'>) => {
    return settings.enabled && settings[type]
  }

  const sendStatusUpdate = async (issueTitle: string, oldStatus: string, newStatus: string, issueId: string) => {
    if (canSendNotification('statusUpdates')) {
      await notificationService.notifyStatusUpdate(issueTitle, oldStatus, newStatus, issueId)
    }
  }

  const sendAchievement = async (achievementTitle: string, description: string) => {
    if (canSendNotification('achievements')) {
      await notificationService.notifyAchievement(achievementTitle, description)
    }
  }

  const sendNearbyIssue = async (issueTitle: string, location: string, category: string) => {
    if (canSendNotification('nearbyIssues')) {
      await notificationService.notifyNearbyIssue(issueTitle, location, category)
    }
  }

  return {
    settings,
    canSendNotification,
    sendStatusUpdate,
    sendAchievement,
    sendNearbyIssue,
    service: notificationService
  }
}