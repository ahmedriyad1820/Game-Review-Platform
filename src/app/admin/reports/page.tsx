'use client'

import { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MessageSquare,
  Gamepad2,
  Star
} from 'lucide-react'

interface Report {
  id: string
  reason: string
  description?: string
  status: string
  createdAt: string
  reporter: {
    username: string
    avatarUrl?: string
  }
  targetType: string
  targetId: string
  targetContent?: {
    title?: string
    username?: string
    content?: string
    rating?: number
  }
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedReason, setSelectedReason] = useState('')

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/admin/reports')
      const data = await response.json()
      setReports(data)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchReports()
      }
    } catch (error) {
      console.error('Error updating report status:', error)
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchReports()
      }
    } catch (error) {
      console.error('Error deleting report:', error)
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reporter.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !selectedStatus || report.status === selectedStatus
    const matchesType = !selectedType || report.targetType === selectedType
    const matchesReason = !selectedReason || report.reason === selectedReason
    return matchesSearch && matchesStatus && matchesType && matchesReason
  })

  const allTypes = Array.from(new Set(reports.map(r => r.targetType)))
  const allStatuses = Array.from(new Set(reports.map(r => r.status)))
  const allReasons = Array.from(new Set(reports.map(r => r.reason)))

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'INVESTIGATING': return 'bg-blue-100 text-blue-800'
      case 'RESOLVED': return 'bg-green-100 text-green-800'
      case 'DISMISSED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'REVIEW': return <Star className="h-4 w-4" />
      case 'USER': return <User className="h-4 w-4" />
      case 'COMMENT': return <MessageSquare className="h-4 w-4" />
      case 'GAME': return <Gamepad2 className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Handle Reports</h1>
          <p className="text-muted-foreground">
            Review and resolve user reports about inappropriate content or behavior
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reports by reason, description, or reporter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Status</option>
            {allStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Types</option>
            {allTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Reasons</option>
            {allReasons.map(reason => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </select>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-background border rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    {report.reporter.avatarUrl ? (
                      <img src={report.reporter.avatarUrl} alt={report.reporter.username} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Reported by {report.reporter.username}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {getTypeIcon(report.targetType)}
                    <span className="text-sm text-muted-foreground">{report.targetType}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-foreground">{report.reason}</span>
                </div>
                {report.description && (
                  <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg">
                    {report.description}
                  </p>
                )}
              </div>

              {report.targetContent && (
                <div className="mb-4 p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Reported Content:</h4>
                  <div className="text-sm text-foreground">
                    {report.targetContent.title && (
                      <div className="mb-1">
                        <span className="font-medium">Title:</span> {report.targetContent.title}
                      </div>
                    )}
                    {report.targetContent.username && (
                      <div className="mb-1">
                        <span className="font-medium">User:</span> {report.targetContent.username}
                      </div>
                    )}
                    {report.targetContent.rating && (
                      <div className="mb-1">
                        <span className="font-medium">Rating:</span> {report.targetContent.rating}/10
                      </div>
                    )}
                    {report.targetContent.content && (
                      <div className="mb-1">
                        <span className="font-medium">Content:</span>
                        <div className="mt-1 p-2 bg-background rounded border">
                          {report.targetContent.content.length > 200 
                            ? `${report.targetContent.content.substring(0, 200)}...` 
                            : report.targetContent.content
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Report ID: {report.id}
                </div>
                <div className="flex items-center space-x-2">
                  {report.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(report.id, 'INVESTIGATING')}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        Investigate
                      </button>
                      <button
                        onClick={() => handleStatusChange(report.id, 'RESOLVED')}
                        className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleStatusChange(report.id, 'DISMISSED')}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                  {report.status === 'INVESTIGATING' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(report.id, 'RESOLVED')}
                        className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleStatusChange(report.id, 'DISMISSED')}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No reports found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
