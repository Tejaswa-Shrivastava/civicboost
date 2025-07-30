import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { X, MapPin, Camera } from '@phosphor-icons/react'
import type { Issue } from '@/App'

interface ReportFormProps {
  onSubmit: (report: Omit<Issue, 'id' | 'submittedAt' | 'updatedAt' | 'points'>) => void
  onCancel: () => void
}

export function ReportForm({ onSubmit, onCancel }: ReportFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    photo: ''
  })

  const categories = [
    'Road & Transportation',
    'Public Safety',
    'Parks & Recreation', 
    'Utilities',
    'Environment',
    'Infrastructure',
    'Other'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      return
    }

    onSubmit({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      photo: formData.photo,
      status: 'submitted'
    })
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          }))
        },
        () => {
          // Fallback to manual entry
          const address = prompt('Please enter the address or location:')
          if (address) {
            setFormData(prev => ({ ...prev, location: address }))
          }
        }
      )
    }
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Report New Issue</CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Issue Title</Label>
            <Input
              id="title"
              placeholder="Brief description of the issue"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select issue category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                placeholder="Enter address or location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
              />
              <Button type="button" variant="outline" onClick={getCurrentLocation}>
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the issue..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Photo (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                      setFormData(prev => ({ ...prev, photo: event.target?.result as string }))
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />
              <Camera className="w-4 h-4 text-muted-foreground" />
            </div>
            {formData.photo && (
              <img src={formData.photo} alt="Issue preview" className="w-32 h-32 object-cover rounded border" />
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Submit Report
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}