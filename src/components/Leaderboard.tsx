import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Star, Award } from '@phosphor-icons/react'
import type { Issue } from '@/App'

interface LeaderboardProps {
  reports: Issue[]
  currentUser?: {
    login: string
    avatarUrl: string
  } | null
}

export function Leaderboard({ reports, currentUser }: LeaderboardProps) {
  // Create mock leaderboard data based on the current user's performance
  const currentUserStats = {
    totalPoints: reports.reduce((sum, report) => sum + report.points, 0),
    totalReports: reports.length,
    resolvedReports: reports.filter(r => r.status === 'resolved').length
  }

  // Generate mock community data for demonstration
  const leaderboardData = [
    {
      rank: 1,
      name: 'Sarah Johnson',
      points: Math.max(450, currentUserStats.totalPoints + 50),
      reports: 23,
      resolved: 18,
      badges: ['Community Champion', 'Problem Solver', 'Safety First']
    },
    {
      rank: 2,
      name: 'Mike Chen',
      points: Math.max(380, currentUserStats.totalPoints + 20),
      reports: 19,
      resolved: 14,
      badges: ['Reliable Reporter', 'Detail Oriented']
    },
    {
      rank: 3,
      name: currentUser?.login || 'You',
      points: currentUserStats.totalPoints || 0,
      reports: currentUserStats.totalReports,
      resolved: currentUserStats.resolvedReports,
      badges: currentUserStats.totalReports >= 5 ? ['Getting Started'] : [],
      isCurrentUser: true
    },
    {
      rank: 4,
      name: 'Alex Rivera',
      points: Math.max(250, currentUserStats.totalPoints - 50),
      reports: 12,
      resolved: 8,
      badges: ['New Reporter']
    },
    {
      rank: 5,
      name: 'Emma Davis',
      points: Math.max(180, currentUserStats.totalPoints - 100),
      reports: 9,
      resolved: 6,
      badges: ['Community Member']
    }
  ].sort((a, b) => b.points - a.points).map((item, index) => ({ ...item, rank: index + 1 }))

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Award className="w-5 h-5 text-gray-400" />
      case 3:
        return <Star className="w-5 h-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Community Leaderboard</h2>
        <p className="text-muted-foreground">Top contributors making our community better</p>
      </div>

      <div className="space-y-3">
        {leaderboardData.map((user) => (
          <Card key={user.rank} className={`${user.isCurrentUser ? 'border-accent bg-accent/5' : ''} hover:shadow-sm transition-shadow`}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getRankIcon(user.rank)}
                    <span className="font-medium">{user.name}</span>
                    {user.isCurrentUser && (
                      <Badge variant="secondary" className="text-xs">You</Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-accent">{user.points}</div>
                    <div className="text-muted-foreground text-xs">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{user.reports}</div>
                    <div className="text-muted-foreground text-xs">Reports</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{user.resolved}</div>
                    <div className="text-muted-foreground text-xs">Resolved</div>
                  </div>
                </div>
              </div>
              
              {user.badges.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {user.badges.map((badge) => (
                    <Badge key={badge} variant="outline" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Earning Points</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Submit a report</span>
            <span className="font-medium text-accent">+10 points</span>
          </div>
          <div className="flex justify-between">
            <span>Report gets resolved</span>
            <span className="font-medium text-accent">+20 bonus points</span>
          </div>
          <div className="flex justify-between">
            <span>Weekly participation</span>
            <span className="font-medium text-accent">+5 points</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}