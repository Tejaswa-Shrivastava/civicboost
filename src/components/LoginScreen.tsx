import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Trophy, Award, Users } from '@phosphor-icons/react'

interface LoginScreenProps {
  onLogin: () => void
  isLoading: boolean
}

export function LoginScreen({ onLogin, isLoading }: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
            <MapPin className="w-12 h-12 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Report & Reward</h1>
            <p className="text-muted-foreground">
              Making our community better, together
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="p-3 bg-accent/10 rounded-lg mx-auto w-fit">
              <MapPin className="w-6 h-6 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground">Report Issues</p>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-accent/10 rounded-lg mx-auto w-fit">
              <Trophy className="w-6 h-6 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground">Earn Points</p>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-accent/10 rounded-lg mx-auto w-fit">
              <Award className="w-6 h-6 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground">Get Rewards</p>
          </div>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in with your GitHub account to start reporting issues and earning rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={onLogin}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Sign in with GitHub
                </div>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Your reports and progress will be saved to your account
            </p>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="text-center space-y-3">
          <h3 className="font-medium text-foreground">Why sign in?</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Track your impact across devices</p>
            <p>• Compete on the community leaderboard</p>
            <p>• Receive notifications about your reports</p>
            <p>• Unlock exclusive achievements</p>
          </div>
        </div>
      </div>
    </div>
  )
}