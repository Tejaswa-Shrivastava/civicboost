import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Bell, BellSlash, MapPin, Trophy, Settings } from '@phosphor-icons/react'
import { notificationService } from '@/lib/notifications'
import { toast } from 'sonner'

export interface NotificationSettings {
  statusUpdates: boolean
  nearbyIssues: boolean
  achievements: boolean
  enabled: boolean
}

export function NotificationCenter() {
  const [settings, setSettings] = useKV<NotificationSettings>('notification-settings', {
    statusUpdates: true,
    nearbyIssues: true,
    achievements: true,
    enabled: false
  })
  
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported(notificationService.isSupported_())
    setPermission(notificationService.getPermission())
  }, [])

  const requestPermission = async () => {
    const result = await notificationService.requestPermission()
    setPermission(result)
    
    if (result === 'granted') {
      setSettings(prev => ({ ...prev, enabled: true }))
      notificationService.startNearbyIssueMonitoring()
      toast.success('Notifications enabled! You\'ll now receive updates about your reports.')
      
      // Send welcome notification
      setTimeout(() => {
        notificationService.sendNotification({
          title: '🎉 Notifications Enabled!',
          body: 'You\'ll now receive updates about status changes and nearby issues.',
          tag: 'welcome'
        })
      }, 1000)
    } else {
      toast.error('Notifications were denied. You can enable them in your browser settings.')
    }
  }

  const disableNotifications = () => {
    setSettings(prev => ({ ...prev, enabled: false }))
    notificationService.stopNearbyIssueMonitoring()
    toast.info('Notifications disabled.')
  }

  const updateSetting = (key: keyof Omit<NotificationSettings, 'enabled'>, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const testNotification = async () => {
    const success = await notificationService.sendNotification({
      title: 'Test Notification',
      body: 'This is a test to make sure notifications are working correctly!',
      tag: 'test'
    })
    
    if (success) {
      toast.success('Test notification sent!')
    } else {
      toast.error('Failed to send test notification.')
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellSlash className="w-5 h-5" />
            Notifications Not Supported
          </CardTitle>
          <CardDescription>
            Your browser doesn't support push notifications.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Get notified about status updates and nearby community issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Permission Status */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <h4 className="font-medium">Notification Permission</h4>
            <p className="text-sm text-muted-foreground">
              {permission === 'granted' && 'Notifications are enabled'}
              {permission === 'denied' && 'Notifications are blocked'}
              {permission === 'default' && 'Click to enable notifications'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={permission === 'granted' ? 'default' : 'secondary'}>
              {permission === 'granted' && '✓ Enabled'}
              {permission === 'denied' && '✗ Blocked'}
              {permission === 'default' && 'Not Set'}
            </Badge>
            {permission === 'default' && (
              <Button onClick={requestPermission}>
                Enable
              </Button>
            )}
            {permission === 'granted' && settings.enabled && (
              <Button variant="outline" size="sm" onClick={disableNotifications}>
                Disable
              </Button>
            )}
          </div>
        </div>

        {/* Notification Types */}
        {permission === 'granted' && settings.enabled && (
          <div className="space-y-4">
            <h4 className="font-medium">Notification Types</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Status Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when your reported issues change status
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.statusUpdates}
                  onCheckedChange={(checked) => updateSetting('statusUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Nearby Issues</p>
                    <p className="text-sm text-muted-foreground">
                      Get alerted about new issues reported near your location
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.nearbyIssues}
                  onCheckedChange={(checked) => updateSetting('nearbyIssues', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Achievements</p>
                    <p className="text-sm text-muted-foreground">
                      Celebrate when you unlock new badges and milestones
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.achievements}
                  onCheckedChange={(checked) => updateSetting('achievements', checked)}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button variant="outline" onClick={testNotification} className="w-full">
                Send Test Notification
              </Button>
            </div>
          </div>
        )}

        {permission === 'denied' && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Notifications are blocked. To enable them:
            </p>
            <ol className="mt-2 text-sm text-muted-foreground list-decimal list-inside space-y-1">
              <li>Click the lock icon in your browser's address bar</li>
              <li>Set notifications to "Allow"</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  )
}