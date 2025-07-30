import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, CheckCircle, AlertCircle, Settings } from '@phosphor-icons/react'
import type { Issue } from '@/App'

interface ReportCardProps {
  report: Issue
  onStatusUpdate: (reportId: string, newStatus: Issue['status']) => void
}

const statusConfig = {
  'submitted': {
    label: 'Submitted',
    color: 'bg-blue-100 text-blue-800',
    icon: <AlertCircle className="w-4 h-4" />
  },
  'under-review': {
    label: 'Under Review',
    color: 'bg-yellow-100 text-yellow-800',
    icon: <Clock className="w-4 h-4" />
  },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-purple-100 text-purple-800',
    icon: <Settings className="w-4 h-4" />
  },
  'resolved': {
    label: 'Resolved',
    color: 'bg-green-100 text-green-800',
    icon: <CheckCircle className="w-4 h-4" />
  }
}

export function ReportCard({ report, onStatusUpdate }: ReportCardProps) {
  const status = statusConfig[report.status]
  const formattedDate = new Date(report.submittedAt).toLocaleDateString()
  const lastUpdated = new Date(report.updatedAt).toLocaleDateString()

  const nextStatus = () => {
    const statusOrder: Issue['status'][] = ['submitted', 'under-review', 'in-progress', 'resolved']
    const currentIndex = statusOrder.indexOf(report.status)
    return currentIndex < statusOrder.length - 1 ? statusOrder[currentIndex + 1] : null
  }

  const next = nextStatus()

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{report.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {report.location}
              </span>
              <span>Submitted: {formattedDate}</span>
              {report.submittedAt !== report.updatedAt && (
                <span>Updated: {lastUpdated}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {report.category}
            </Badge>
            <Badge className={`${status.color} flex items-center gap-1`}>
              {status.icon}
              {status.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{report.description}</p>
          
          {report.photo && (
            <img 
              src={report.photo} 
              alt="Issue photo" 
              className="w-full max-w-md h-48 object-cover rounded border"
            />
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-accent">
                +{report.points} points
              </span>
              <span className="text-xs text-muted-foreground">
                ID: {report.id}
              </span>
            </div>
            
            {next && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusUpdate(report.id, next)}
                className="text-xs"
              >
                Mark as {statusConfig[next].label}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}