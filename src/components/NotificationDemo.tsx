import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, Trophy, MapPin, Settings } from '@phosphor-icons/react'
import { useNotifications } from '@/hooks/useNotifications'
import { toast } from 'sonner'

export function NotificationDemo() {
  const { service } = useNotifications()

  const demoNotifications = [
    {
      type: 'status',
      title: 'Status Update Demo',
      action: () => service.notifyStatusUpdate(
        'Broken streetlight on Main St',
        'submitted',
        'in-progress',
        'demo-123'
      ),
      description: 'Shows how status updates are delivered'
    },
    {
      type: 'achievement',
      title: 'Achievement Demo',
      action: () => service.notifyAchievement(
        'Demo Master',
        'Successfully tested the notification system'
      ),
      description: 'Celebrates when you unlock new badges'
    },
    {
      type: 'nearby',
      title: 'Nearby Issue Demo',
      action: () => service.notifyNearbyIssue(
        'Pothole reported on Oak Avenue',
        'Near your location',
        'Infrastructure'
      ),
      description: 'Alerts about issues in your area'
    }
  ]

  const sendDemo = async (demo: typeof demoNotifications[0]) => {
    const permission = service.getPermission()
    
    if (permission !== 'granted') {
      toast.error('Please enable notifications first to see the demo!')
      return
    }

    try {
      await demo.action()
      toast.success(`${demo.title} sent! Check your notifications.`)
    } catch (error) {
      toast.error('Failed to send demo notification')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Try Demo Notifications
        </CardTitle>
        <CardDescription>
          Test different types of notifications to see how they work
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {demoNotifications.map((demo, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {demo.type === 'status' && <Settings className="w-4 h-4 text-blue-500" />}
              {demo.type === 'achievement' && <Trophy className="w-4 h-4 text-amber-500" />}
              {demo.type === 'nearby' && <MapPin className="w-4 h-4 text-green-500" />}
              <div>
                <p className="font-medium text-sm">{demo.title}</p>
                <p className="text-xs text-muted-foreground">{demo.description}</p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => sendDemo(demo)}
            >
              Send
            </Button>
          </div>
        ))}
        
        <div className="pt-3 border-t text-center">
          <p className="text-xs text-muted-foreground">
            💡 Notifications appear outside the browser and can include action buttons
          </p>
        </div>
      </CardContent>
    </Card>
  )
}