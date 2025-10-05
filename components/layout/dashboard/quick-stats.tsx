"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { diaryEntriesAPI } from "@/lib/api/diaryEntriesAPI"
import { medicalRecordsAPI } from "@/lib/api/medicalRecordAPI"

interface QuickStatsProps {
  selectedBabyId: string | null
}

export function QuickStats({ selectedBabyId }: QuickStatsProps) {
  const [stats, setStats] = useState({
    monthlyPhotos: 0,
    newMilestones: 0,
    upcomingAppointments: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!selectedBabyId) {
        setStats({ monthlyPhotos: 0, newMilestones: 0, upcomingAppointments: 0 })
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        // Get current month diary entries
        const diaryRes = await diaryEntriesAPI.getAll({ childId: selectedBabyId })
        const diaryEntries = diaryRes.data?.data?.data || []
        
        // Calculate photos from current month
        const now = new Date()
        const currentMonthEntries = diaryEntries.filter((entry: any) => {
          const entryDate = new Date(entry.created_at)
          return entryDate.getMonth() === now.getMonth() && 
                 entryDate.getFullYear() === now.getFullYear()
        })
        const monthlyPhotos = currentMonthEntries.reduce(
          (sum: number, entry: any) => sum + (entry.imageUrls?.length || 0), 
          0
        )

        // Get upcoming appointments (medical records with future dates)
        const medicalRes = await medicalRecordsAPI.getAll({ childId: selectedBabyId })
        const allRecords = medicalRes.data || []
        const upcomingAppointments = allRecords.filter((record: any) => 
          new Date(record.recordDate) >= now
        ).length

        // Calculate new milestones from last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const newMilestones = diaryEntries.filter((entry: any) => {
          const entryDate = new Date(entry.created_at)
          return entryDate >= thirtyDaysAgo
        }).length

        setStats({
          monthlyPhotos,
          newMilestones,
          upcomingAppointments
        })
      } catch (err) {
        console.error("Error fetching quick stats:", err)
        setStats({ monthlyPhotos: 0, newMilestones: 0, upcomingAppointments: 0 })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [selectedBabyId])

  if (isLoading) {
    return (
      <div className="px-2 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Đang tải...</span>
          <Badge variant="secondary">...</Badge>
        </div>
      </div>
    )
  }

  return (
    <div className="px-2 space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Ảnh tháng này</span>
        <Badge variant="secondary">{stats.monthlyPhotos}</Badge>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Cột mốc mới</span>
        <Badge variant="secondary">{stats.newMilestones}</Badge>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Lịch hẹn</span>
        <Badge variant="outline">{stats.upcomingAppointments}</Badge>
      </div>
    </div>
  )
}