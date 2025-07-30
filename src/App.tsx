import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Trophy, Plus, Camera, Award } from '@phosphor-icons/react'
import { ReportForm } from '@/components/ReportForm'
import { ReportCard } from '@/components/ReportCard'
import { Leaderboard } from '@/components/Leaderboard'
import { UserStats } from '@/components/UserStats'

export interface Issue {
  id: string
  title: string
  description: string
  category: string
  location: string
  photo?: string
  status: 'submitted' | 'under-review' | 'in-progress' | 'resolved'
  points: number
  submittedAt: string
  updatedAt: string
}

export interface UserProfile {
  totalPoints: number
  totalReports: number
  achievements: string[]
}

function App() {
  const [reports, setReports] = useKV<Issue[]>('user-reports', [])
  const [userProfile, setUserProfile] = useKV<UserProfile>('user-profile', {
    totalPoints: 0,
    totalReports: 0,
    achievements: []
  })
  const [showReportForm, setShowReportForm] = useState(false)

  const addReport = (newReport: Omit<Issue, 'id' | 'submittedAt' | 'updatedAt' | 'points'>) => {
    const issue: Issue = {
      ...newReport,
      id: `issue-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      points: 10 // Base points for submitting
    }

    setReports(current => [...current, issue])
    
    // Update user profile
    setUserProfile(current => {
      const newTotalPoints = current.totalPoints + 10
      const newTotalReports = current.totalReports + 1
      const newAchievements = [...current.achievements]
      
      // Award achievements
      if (newTotalReports === 1 && !newAchievements.includes('first-report')) {
        newAchievements.push('first-report')
      }
      if (newTotalReports === 5 && !newAchievements.includes('reporter')) {
        newAchievements.push('reporter')
      }
      if (newTotalPoints >= 100 && !newAchievements.includes('centurion')) {
        newAchievements.push('centurion')
      }

      return {
        totalPoints: newTotalPoints,
        totalReports: newTotalReports,
        achievements: newAchievements
      }
    })

    setShowReportForm(false)
  }

  const updateReportStatus = (reportId: string, newStatus: Issue['status']) => {
    setReports(current => 
      current.map(report => {
        if (report.id === reportId) {
          let bonusPoints = 0
          if (newStatus === 'resolved' && report.status !== 'resolved') {
            bonusPoints = 20 // Bonus points for resolved issues
          }
          
          const updated = {
            ...report,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            points: report.points + bonusPoints
          }

          // Update user profile with bonus points
          if (bonusPoints > 0) {
            setUserProfile(prev => ({
              ...prev,
              totalPoints: prev.totalPoints + bonusPoints
            }))
          }

          return updated
        }
        return report
      })
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Report & Reward</h1>
                <p className="text-sm text-muted-foreground">Making our community better, together</p>
              </div>
            </div>
            <UserStats profile={userProfile} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              My Reports
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Issue Reports</h2>
                <p className="text-muted-foreground">Track and manage your community reports</p>
              </div>
              <Button 
                onClick={() => setShowReportForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Report Issue
              </Button>
            </div>

            {showReportForm && (
              <ReportForm
                onSubmit={addReport}
                onCancel={() => setShowReportForm(false)}
              />
            )}

            <div className="grid gap-4">
              {reports.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No reports yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start making a difference by reporting your first issue!
                    </p>
                    <Button onClick={() => setShowReportForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Report Your First Issue
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                reports.map(report => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onStatusUpdate={updateReportStatus}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard reports={reports} />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Your Achievements</h2>
              <p className="text-muted-foreground">Unlock badges by actively participating in your community</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  id: 'first-report',
                  title: 'Getting Started',
                  description: 'Submit your first report',
                  icon: <Camera className="w-6 h-6" />,
                  unlocked: userProfile.achievements.includes('first-report')
                },
                {
                  id: 'reporter',
                  title: 'Community Reporter',
                  description: 'Submit 5 reports',
                  icon: <MapPin className="w-6 h-6" />,
                  unlocked: userProfile.achievements.includes('reporter')
                },
                {
                  id: 'centurion',
                  title: 'Point Centurion',
                  description: 'Earn 100 points',
                  icon: <Trophy className="w-6 h-6" />,
                  unlocked: userProfile.achievements.includes('centurion')
                }
              ].map(achievement => (
                <Card key={achievement.id} className={achievement.unlocked ? 'bg-accent/5 border-accent/20' : 'opacity-60'}>
                  <CardHeader className="text-center">
                    <div className={`p-3 rounded-full w-fit mx-auto ${achievement.unlocked ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {achievement.icon}
                    </div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge variant={achievement.unlocked ? "default" : "secondary"}>
                      {achievement.unlocked ? 'Unlocked' : 'Locked'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App