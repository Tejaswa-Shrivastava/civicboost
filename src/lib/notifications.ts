/**
 * Push notification service for status updates and nearby issues
 * Handles permission requests, subscription management, and notification display
 */

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

export class NotificationService {
  private static instance: NotificationService
  private isSupported = false
  private permission: NotificationPermission = 'default'

  constructor() {
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator
    this.permission = this.isSupported ? Notification.permission : 'denied'
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  /**
   * Check if push notifications are supported
   */
  isSupported_(): boolean {
    return this.isSupported
  }

  /**
   * Get current permission status
   */
  getPermission(): NotificationPermission {
    return this.permission
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      return 'denied'
    }

    try {
      this.permission = await Notification.requestPermission()
      return this.permission
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return 'denied'
    }
  }

  /**
   * Send a local notification
   */
  async sendNotification(payload: NotificationPayload): Promise<boolean> {
    if (this.permission !== 'granted') {
      return false
    }

    try {
      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/favicon.ico',
        badge: payload.badge || '/favicon.ico',
        tag: payload.tag,
        data: payload.data,
        requireInteraction: true,
        actions: payload.actions
      })

      // Auto-close notification after 8 seconds if not interactive
      if (!payload.actions || payload.actions.length === 0) {
        setTimeout(() => {
          notification.close()
        }, 8000)
      }

      // Handle notification click
      notification.onclick = (event) => {
        event.preventDefault()
        window.focus()
        notification.close()
        
        // Navigate to relevant section if data provided
        if (payload.data?.route) {
          window.location.hash = payload.data.route
        }
      }

      return true
    } catch (error) {
      console.error('Error sending notification:', error)
      return false
    }
  }

  /**
   * Send status update notification
   */
  async notifyStatusUpdate(issueTitle: string, oldStatus: string, newStatus: string, issueId: string): Promise<void> {
    const statusEmojis = {
      'submitted': '📋',
      'under-review': '👀',
      'in-progress': '🔧',
      'resolved': '✅'
    }

    const payload: NotificationPayload = {
      title: 'Issue Status Updated',
      body: `"${issueTitle}" is now ${newStatus}`,
      icon: '/favicon.ico',
      tag: `status-${issueId}`,
      data: {
        type: 'status-update',
        issueId,
        oldStatus,
        newStatus,
        route: 'reports'
      },
      actions: [
        {
          action: 'view',
          title: 'View Report'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    }

    await this.sendNotification(payload)
  }

  /**
   * Send nearby issue notification
   */
  async notifyNearbyIssue(issueTitle: string, location: string, category: string): Promise<void> {
    const categoryEmojis = {
      'Infrastructure': '🏗️',
      'Safety': '⚠️',
      'Environment': '🌱',
      'Transportation': '🚗',
      'Public Services': '🏛️',
      'Other': '📍'
    }

    const payload: NotificationPayload = {
      title: 'New Issue Near You',
      body: `${categoryEmojis[category as keyof typeof categoryEmojis] || '📍'} "${issueTitle}" reported at ${location}`,
      icon: '/favicon.ico',
      tag: 'nearby-issue',
      data: {
        type: 'nearby-issue',
        location,
        category,
        route: 'leaderboard'
      },
      actions: [
        {
          action: 'view',
          title: 'View Details'
        },
        {
          action: 'report',
          title: 'Report Similar'
        }
      ]
    }

    await this.sendNotification(payload)
  }

  /**
   * Send achievement notification
   */
  async notifyAchievement(achievementTitle: string, description: string): Promise<void> {
    const payload: NotificationPayload = {
      title: '🏆 Achievement Unlocked!',
      body: `${achievementTitle}: ${description}`,
      icon: '/favicon.ico',
      tag: 'achievement',
      data: {
        type: 'achievement',
        route: 'achievements'
      }
    }

    await this.sendNotification(payload)
  }

  /**
   * Check if user location is near reported issues (mock implementation)
   */
  async checkNearbyIssues(userLocation?: { lat: number; lng: number }): Promise<void> {
    // Mock implementation - in a real app, this would check against a geospatial database
    if (Math.random() > 0.7) { // 30% chance to show nearby issue
      await this.notifyNearbyIssue(
        'Broken streetlight affecting visibility',
        'Downtown Main Street',
        'Infrastructure'
      )
    }
  }

  /**
   * Schedule periodic notifications for nearby issues
   */
  startNearbyIssueMonitoring(): void {
    // Check for nearby issues every 30 minutes
    setInterval(() => {
      if (this.permission === 'granted') {
        this.checkNearbyIssues()
      }
    }, 30 * 60 * 1000)
  }

  /**
   * Stop nearby issue monitoring
   */
  stopNearbyIssueMonitoring(): void {
    // In a real implementation, we'd clear specific intervals
    // For now, this is a placeholder
  }
}

export const notificationService = NotificationService.getInstance()