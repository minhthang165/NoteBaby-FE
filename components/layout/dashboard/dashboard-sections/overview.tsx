"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Camera,
  Heart,
  BookOpen,
  Calendar,
  Users,
  ImageIcon,
  Clock,
  Cake,
  Weight,
  Ruler,
  Edit,
  Plus,
  Trash2,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { QuickUpdateModal } from "@/components/quick-update-modal"
import { AddActivityModal } from "@/components/add-activity-modal"
import { differenceInMonths, differenceInDays } from "date-fns"
import { eventsAPI } from "@/lib/api/eventAPI"
import { healthStatusAPI } from "@/lib/api/healthStatusAPI"
import { babiesAPI } from "@/lib/api/babiesApi"
import { diaryEntriesAPI } from "@/lib/api/diaryEntriesAPI"

interface HealthStatus {
  weight: number
  height: number
  checkedAt: string
 
}

interface Activity {
  id: string
  type: string
  content: string
  time: string
  icon: string
  date: string
}

interface Event {
  _id: string
  title: string
  startAt: string
  endAt: string
  eventType: "school" | "extraClass" | "sport" | "other"
  notes?: string
  childId?: string
  createdBy?: string
}

type OverviewSectionProps = {
  baby: any
}

export function OverviewSection({ baby }: OverviewSectionProps) {
  // Use per-baby localStorage key for activities
  const babyActivitiesKey = baby?._id ? `baby-activities-${baby._id}` : "baby-activities"
  const [activities, setActivities, activitiesMounted] = useLocalStorage<Activity[]>(babyActivitiesKey, [])

  // Pagination for recent activities
  const [activityPage, setActivityPage] = useState(1);
  const activityPageSize = 4;
  const activityTotalPages = Math.ceil(activities.length / activityPageSize);
  const paginatedActivities = activities.slice((activityPage - 1) * activityPageSize, activityPage * activityPageSize);
  // Log activity for healthStatus
  const addActivityFromHealthStatus = (status: any) => {
    const activity: Activity = {
      id: Date.now().toString(),
      type: "healthStatus",
      content: `Thêm chỉ số sức khỏe: ${status.weight}kg, ${status.height}cm`,
      icon: "Heart",
      date: status.created_at || new Date().toISOString(),
      time: formatTimeAgo(status.created_at || new Date().toISOString()),
    };
    setActivities((prev) => [activity, ...prev]);
  };

  // Log activity for medicalRecord
  const addActivityFromMedicalRecord = (record: any) => {
    const activity: Activity = {
      id: Date.now().toString(),
      type: "medicalRecord",
      content: `Thêm hồ sơ khám: ${record.name} (${record.recordType === 'vaccination' ? 'Tiêm chủng' : 'Khám bệnh'})`,
      icon: "BookOpen",
      date: record.recordDate || new Date().toISOString(),
      time: formatTimeAgo(record.recordDate || new Date().toISOString()),
    };
    setActivities((prev) => [activity, ...prev]);
  };

  // Export for use in other files
  (window as any).addActivityFromHealthStatus = addActivityFromHealthStatus;
  (window as any).addActivityFromMedicalRecord = addActivityFromMedicalRecord;
  // Format event thành activity và lưu vào activities
  const addActivityFromEvent = (event: Event, actionType: "add" | "update" = "add") => {
    const activity: Activity = {
      id: Date.now().toString(),
      type: "event",
      content:
        actionType === "add"
          ? `Thêm sự kiện: ${event.title}`
          : `Cập nhật sự kiện: ${event.title}`,
      icon: "Calendar",
      date: event.startAt || new Date().toISOString(),
      time: formatTimeAgo(event.startAt || new Date().toISOString()),
    };
    setActivities([activity, ...activities]);
  };
  const [showQuickUpdate, setShowQuickUpdate] = useState(false)
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    type: "activity" | "event"
    id: string
    title: string
  }>({
    isOpen: false,
    type: "activity",
    id: "",
    title: "",
  })

  // Events lấy từ API
  const [events, setEvents] = useState<Event[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)

  const fetchEvents = async () => {
    if (!baby?._id) return
    setEventsLoading(true)
    try {
      const response = await eventsAPI.getAll({ childId: baby._id })
      // If response is in expected format
      if (Array.isArray(response.data)) {
        setEvents(response.data)
      } else {
        setEvents([])
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
      setEvents([])
    } finally {
      setEventsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [baby?._id])

  const [babyStats, setBabyStats, statsMounted] = useLocalStorage("baby-stats", {
    weight: "--",
    height: "--",
    photos: 0,
    notes: 0,
  })

  // State for milestones/diary entries
  const [milestones, setMilestones] = useState<any[]>([])
  const [milestonesLoading, setMilestonesLoading] = useState(true)

  // State for upcoming appointment
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  useEffect(() => {
    const fetchDiaryEntries = async () => {
      if (!baby?._id) {
        setMilestones([])
        setMilestonesLoading(false)
        return
      }
      setMilestonesLoading(true)
      try {
        const res = await diaryEntriesAPI.getAll({ childId: baby._id })
        setMilestones(res.data?.data?.data || [])
      } catch (err) {
        setMilestones([])
      } finally {
        setMilestonesLoading(false)
      }
    }
    fetchDiaryEntries()
  }, [baby?._id])

  // Fetch upcoming appointments (medical records)
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!baby?._id) {
        setAppointments([]);
        setAppointmentsLoading(false);
        return;
      }
      setAppointmentsLoading(true);
      try {
        const res = await import('@/lib/api/medicalRecordAPI').then(m => m.medicalRecordsAPI.getAll({ childId: baby._id, sortOrder: 'asc', sortBy: 'recordDate' }));
        // Only show future appointments (recordDate >= today)
        const now = new Date();
        const all = res.data || [];
        const upcoming = all.filter((a: any) => new Date(a.recordDate) >= now);
        setAppointments(upcoming);
      } catch (err) {
        setAppointments([]);
      } finally {
        setAppointmentsLoading(false);
      }
    };
    fetchAppointments();
  }, [baby?._id]);
  const [healthStatusList, setHealthStatusList] = useState<HealthStatus[]>([])
  const [healthStatusLoading, setHealthStatusLoading] = useState(true)

  useEffect(() => {
    const fetchHealthStatus = async () => {
      if (!baby?._id) return
      setHealthStatusLoading(true)
      try {
        const res = await healthStatusAPI.getAll({ childId: baby._id })
        setHealthStatusList(res.data || [])
      } catch (err) {
        setHealthStatusList([])
      } finally {
        setHealthStatusLoading(false)
      }
    }
    fetchHealthStatus()
  }, [baby?._id])

  // Always pick the entry with the latest created_at date (sort by created_at desc)
  const latestHealthStatus = healthStatusList.length > 0
    ? [...healthStatusList].sort((a, b) => new Date((b as any).created_at || b.checkedAt).getTime() - new Date((a as any).created_at || a.checkedAt).getTime())[0]
    : null;
  const stats = [
    {
      title: "Cân nặng hiện tại",
      value: latestHealthStatus ? `${latestHealthStatus.weight} kg` : babyStats.weight,
      icon: Weight,
      color: "text-blue-600",
      change: latestHealthStatus ? `Cập nhật: ${latestHealthStatus.checkedAt}` : "+0.3kg tuần này",
      action: () => setShowQuickUpdate(true),
    },
    {
      title: "Chiều cao hiện tại",
      value: latestHealthStatus ? `${latestHealthStatus.height} cm` : babyStats.height,
      icon: Ruler,
      color: "text-green-600",
      change: latestHealthStatus ? `Cập nhật: ${latestHealthStatus.checkedAt}` : "+1cm tuần này",
      action: () => setShowQuickUpdate(true),
    },
    {
      title: "Tổng số ảnh",
      value: babyStats.photos.toString(),
      icon: ImageIcon,
      color: "text-purple-600",
      change: "+12 tuần này",
    },
    {
      title: "Ghi chú phát triển",
      value: milestonesLoading ? "--" : milestones.length.toString(),
      icon: BookOpen,
      color: "text-orange-600",
      change: milestonesLoading ? "" : `+${milestones.length} tổng nhật ký`,
    },
  ]


  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Camera,
      BookOpen,
      Heart,
      Calendar,
    }
    return icons[iconName] || Camera
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Vừa xong"
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} ngày trước`
    return `${Math.floor(diffInHours / 168)} tuần trước`
  }

  

  
const handleAddEvent = async (newEventData: Omit<Event, "_id" | "childId">) => {
  if (!baby?._id) {
    toast({ title: "Lỗi", description: "Không tìm thấy thông tin bé", variant: "destructive" });
    return;
  }
  const payload = {
    ...newEventData,
    childId: baby._id,
  };
  try {
    const res = await eventsAPI.create(payload);
    toast({ title: "Thành công", description: "Đã thêm sự kiện mới." });
    if (res) {
      addActivityFromEvent(res, "add");
    }
    fetchEvents();
  } catch (err) {
    toast({ title: "Lỗi", description: "Không thể thêm sự kiện, vui lòng thử lại.", variant: "destructive" });
  }
};

  const handleUpdateEvent = async (updatedEvent: Event) => {
    if (!baby?._id) {
      toast({ title: "Lỗi", description: "Không tìm thấy thông tin bé", variant: "destructive" });
      return;
    }
    try {
      // Ensure childId and remove _id from payload
      const { _id, ...updateData } = updatedEvent;
      const payload = {
        ...updateData,
        childId: baby._id, // Make sure childId is included in update
      };
      const res = await eventsAPI.update(_id, payload);
      toast({ title: "Cập nhật sự kiện thành công!", description: `Đã cập nhật sự kiện "${updatedEvent.title}"` });
      if (res) {
        addActivityFromEvent(res, "update");
      }
      fetchEvents();
      setEditingEvent(null);
    } catch (err) {
      toast({ title: "Lỗi", description: "Không thể cập nhật sự kiện", variant: "destructive" });
    }
  }

  const handleDeleteEvent = async (_id: string) => {
    try {
      await eventsAPI.remove(_id)
      toast({ title: "Đã xóa sự kiện!", description: "Sự kiện đã được xóa khỏi lịch", variant: "destructive" })
      fetchEvents()
    } catch (err) {
      toast({ title: "Lỗi", description: "Không thể xóa sự kiện", variant: "destructive" })
    }
  }

  const confirmDeleteEvent = async () => {
    if (deleteDialog.id) {
      await handleDeleteEvent(deleteDialog.id)
    }
    setDeleteDialog({ isOpen: false, type: "activity", id: "", title: "" })
  }

 

  useEffect(() => {
    if (!activitiesMounted) return

    const interval = setInterval(() => {
      setActivities((prev) =>
        prev.map((activity) => ({
          ...activity,
          time: formatTimeAgo(activity.date),
        })),
      )
    }, 60000)

    return () => clearInterval(interval)
  }, [activitiesMounted, setActivities])

  if (!activitiesMounted || !statsMounted) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!baby) return null

  // Tính số tháng và ngày tuổi
  const dob = new Date(baby.dob)
  const now = new Date()
  const months = differenceInMonths(now, dob)
  const days = differenceInDays(now, new Date(dob.getFullYear(), dob.getMonth() + months, dob.getDate()))

  // Lấy tên đầy đủ
  const fullName = `${baby.lastName ? baby.lastName : ""} ${baby.firstName ? baby.firstName : ""}`.trim()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-pink-50 border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={baby.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                {baby.firstName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Chào mừng trở lại! </h1>
              <p className="text-gray-600 mb-2">
                Hôm nay {fullName} đã {months} tháng {days} ngày tuổi
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Cake className="h-4 w-4" />
                  Sinh ngày {new Date(baby.dob).toLocaleDateString("vi-VN")}
                </span>
                <Badge variant="outline" className="bg-white">
                        {baby.gender === "Male" ? "Bé trai" : "Bé gái"}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowQuickUpdate(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Cập nhật nhanh
              </Button> 
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Section (giả định có sẵn) */}
      {/* ...existing code for stats cards... */}

      {/* ...existing code for Activities & Events table/grid... */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow cursor-pointer" onClick={stat.action}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                    {stat.action && <Edit className="h-3 w-3 text-gray-400" />}
                  </div>
                </div>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Hoạt động gần đây - {fullName}
              </CardTitle>
                    </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Chưa có hoạt động nào</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowAddActivity(true)}>
                  Thêm hoạt động đầu tiên
                </Button>
              </div>
            ) : (
              <>
                {paginatedActivities.map((activity) => {
                  const Icon = getIconComponent(activity.icon)
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                    >
                      <Icon className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.content}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  )
                })}
                {/* Pagination controls for activities */}
                {activityTotalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => setActivityPage(activityPage - 1)} disabled={activityPage === 1}>
                      Trước
                    </Button>
                    <span className="text-sm">Trang {activityPage} / {activityTotalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => setActivityPage(activityPage + 1)} disabled={activityPage === activityTotalPages}>
                      Sau
                    </Button>
                  </div>
                )}
              </>
            )}   
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Sự kiện sắp tới
              </CardTitle>
              <Button size="sm" onClick={() => setEditingEvent({ _id: '', title: '', startAt: '', endAt: '', eventType: 'other' })}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {eventsLoading ? (
              <div className="text-center py-8 text-gray-500">Đang tải sự kiện...</div>
            ) : events.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Chưa có sự kiện nào</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setEditingEvent(null)}
                >
                  Thêm sự kiện đầu tiên
                </Button>
              </div>
            ) : (
              <>
                {events.map((event) => (
                  <div key={event._id} className="flex items-center justify-between p-3 rounded-lg bg-blue-50 group">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(event.startAt).toLocaleDateString("vi-VN")}
                        {event.endAt && event.endAt !== event.startAt
                          ? ` - ${new Date(event.endAt).toLocaleDateString("vi-VN")}`
                          : ""}
                      </p>
                      {event.notes && <p className="text-xs text-gray-500">{event.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>
                        {event.eventType === "sport"
                          ? "Thể thao"
                          : event.eventType === "school"
                          ? "Học tập"
                          : event.eventType === "extraClass"
                          ? "Lớp thêm"
                          : "Khác"}
                      </Badge>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setEditingEvent(event)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteDialog({
                          isOpen: true,
                          type: "event",
                          id: event._id,
                          title: event.title,
                        })}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Xem lịch đầy đủ ({events.length})
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
  {(!appointmentsLoading && appointments.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="shadow-md border rounded-xl col-span-1">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 rounded-t-xl">
              <CardTitle className="text-lg font-bold text-blue-700">Lịch hẹn sắp tới</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                {appointments[0].recordType === 'vaccination' ?
                  <Calendar className="h-5 w-5 text-blue-500" /> :
                  <Ruler className="h-5 w-5 text-green-500" />
                }
                <p className="text-sm text-gray-500">
                  {appointments[0].recordType === 'vaccination' ? 'Tiêm chủng' : 'Khám bệnh'}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium text-gray-600">Tên lịch hẹn:</p>
                <p className="text-blue-700 font-semibold">{appointments[0].name}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Thời gian:</p>
                <p className="text-blue-700">{new Date(appointments[0].recordDate).toLocaleString('vi-VN')}</p>
              </div>
              {appointments[0].location && (
                <div>
                  <p className="font-medium text-gray-600">Địa điểm:</p>
                  <p className="text-green-700">{appointments[0].location}</p>
                </div>
              )}
              {appointments[0].notes && (
                <div>
                  <p className="font-medium text-gray-600">Ghi chú:</p>
                  <p className="bg-gray-100 p-2 rounded-md text-gray-700 border-l-4 border-blue-400">{appointments[0].notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Placeholder for another section (half width) */}
          <div className="col-span-1"></div>
        </div>
      )}



      

      <AddEventModal
        isOpen={editingEvent !== null}
        onClose={() => setEditingEvent(null)}
        onSave={editingEvent && editingEvent._id ? handleUpdateEvent : handleAddEvent}
        editingEvent={editingEvent}
      />

      <QuickUpdateModal
        isOpen={showQuickUpdate}
        onClose={() => setShowQuickUpdate(false)}
        onUpdate={async (data) => {
          try {
            await babiesAPI.update(baby._id, data);
            toast({
              title: "Thành công",
              description: "Đã cập nhật thông tin của bé",
            });
            // Reload page to refresh data
            window.location.reload();
          } catch (error) {
            toast({
              title: "Lỗi",
              description: "Không thể cập nhật thông tin. Vui lòng thử lại sau.",
              variant: "destructive",
            });
          }
        }}
        baby={baby}
      />

      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, isOpen: open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Sự kiện này sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteEvent} className="bg-red-600 hover:bg-red-700 text-white">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Add Event Modal Component
function AddEventModal({
  isOpen,
  onClose,
  onSave,
  editingEvent,
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (event: any) => void
  editingEvent: Event | null
}) {
  const [formData, setFormData] = useState({
    title: "",
    startAt: "",
    endAt: "",
    eventType: "other",
    notes: "",
  })

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title || "",
        startAt: editingEvent.startAt ? editingEvent.startAt.slice(0, 10) : "",
        endAt: editingEvent.endAt ? editingEvent.endAt.slice(0, 10) : "",
        eventType: editingEvent.eventType || "other",
        notes: editingEvent.notes || "",
      })
    } else {
      setFormData({
        title: "",
        startAt: "",
        endAt: "",
        eventType: "other",
        notes: "",
      })
    }
  }, [editingEvent])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingEvent && editingEvent._id) {
      // When updating, preserve the childId and _id
      onSave({
        ...editingEvent,
        ...formData,
        childId: editingEvent.childId // Ensure childId is preserved
      })
    } else {
      onSave(formData)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">{editingEvent && editingEvent._id ? "Chỉnh sửa sự kiện" : "Thêm sự kiện mới"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tiêu đề *</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-md"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="VD: Khám định kỳ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ngày bắt đầu *</label>
              <input
                type="date"
                required
                className="w-full p-2 border rounded-md"
                value={formData.startAt}
                onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ngày kết thúc</label>
              <input
                type="date"
                className="w-full p-2 border rounded-md"
                value={formData.endAt}
                onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Loại sự kiện</label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value as Event["eventType"] })}
              >
                <option value="other">Khác</option>
                <option value="sport">Thể thao</option>
                <option value="school">Học tập</option>
                <option value="extraClass">Lớp thêm</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ghi chú</label>
              <textarea
                className="w-full p-2 border rounded-md"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ghi chú thêm (nếu có)"
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                {editingEvent && editingEvent._id ? "Cập nhật" : "Thêm"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
