import { Badge } from '@/components/ui/badge'
import { Trophy, Star } from '@phosphor-icons/react'
import type { UserProfile } from '@/App'

interface UserStatsProps {
  profile: UserProfile
}

export function UserStats({ profile }: UserStatsProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm">
        <Star className="w-4 h-4 text-accent" />
        <span className="font-medium">{profile.totalPoints}</span>
        <span className="text-muted-foreground">points</span>
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <Trophy className="w-4 h-4 text-primary" />
        <span className="font-medium">{profile.totalReports}</span>
        <span className="text-muted-foreground">reports</span>
      </div>

      {profile.achievements.length > 0 && (
        <Badge variant="secondary" className="text-xs">
          {profile.achievements.length} {profile.achievements.length === 1 ? 'badge' : 'badges'}
        </Badge>
      )}
    </div>
  )
}