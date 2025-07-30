import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { SignOut, User, Trophy } from '@phosphor-icons/react'

interface UserProfile {
  totalPoints: number
  totalReports: number
  achievements: string[]
}

interface UserMenuProps {
  user: {
    login: string
    avatarUrl: string
    email: string
  }
  profile: UserProfile
  onLogout: () => void
}

export function UserMenu({ user, profile, onLogout }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl} alt={user.login} />
            <AvatarFallback>
              {user.login.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.login}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="p-2 space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="w-4 h-4 text-accent" />
            <span className="font-medium">{profile.totalPoints}</span>
            <span className="text-muted-foreground">points</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-primary" />
            <span className="font-medium">{profile.totalReports}</span>
            <span className="text-muted-foreground">reports</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-destructive">
          <SignOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}