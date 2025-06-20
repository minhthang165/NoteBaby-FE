"use client"

import type React from "react"

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
import { useState, useEffect } from "react"

// Thêm import cho toast và dialog
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

interface Activity {
  id: string
  type: string
  content: string
  time: string
  icon: string
  date: string
}

interface Event {
  id: string
  title: string
  date: string
  type: string
  priority: string
  description?: string
}

export function OverviewSection() {
  const [showQuickUpdate, setShowQuickUpdate] = useState(false)
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  // Thêm state cho dialog xác nhận
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

  // Cập nhật useLocalStorage để sử dụng isMounted
  const [activities, setActivities, activitiesMounted] = useLocalStorage<Activity[]>("baby-activities", [
    {
      id: "1",
      type: "photo",
      content: "Thêm 5 ảnh mới vào album 'Tháng 12'",
      time: "2 giờ trước",
      icon: "Camera",
      date: new Date().toISOString(),
    },
    {
      id: "2",
      type: "milestone",
      content: "Bé đã biết nói từ 'mama'",
      time: "1 ngày trước",
      icon: "BookOpen",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      type: "health",
      content: "Cập nhật cân nặng: 8.2kg",
      time: "3 ngày trước",
      icon: "Heart",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      type: "schedule",
      content: "Thêm lịch học bơi vào thứ 7",
      time: "1 tuần trước",
      icon: "Calendar",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ])

  const [events, setEvents, eventsMounted] = useLocalStorage<Event[]>("baby-events", [
    { id: "1", title: "Khám định kỳ", date: "25/12/2024", type: "health", priority: "high" },
    { id: "2", title: "Học bơi", date: "28/12/2024", type: "activity", priority: "normal" },
    { id: "3", title: "Sinh nhật bé", date: "15/04/2025", type: "milestone", priority: "high" },
  ])

  const [babyStats, setBabyStats, statsMounted] = useLocalStorage("baby-stats", {
    weight: "8.2 kg",
    height: "69 cm",
    photos: 247,
    notes: 32,
  })

  // Mock data cho bé hiện tại
  const currentBaby = {
    name: "Bé Minh",
    age: "8 tháng 15 ngày",
    birthDate: "15/04/2024",
    avatar: "/placeholder.svg?height=60&width=60",
    gender: "boy",
    weight: babyStats.weight,
    height: babyStats.height,
  }

  const stats = [
    {
      title: "Cân nặng hiện tại",
      value: babyStats.weight,
      icon: Weight,
      color: "text-blue-600",
      change: "+0.3kg tuần này",
      action: () => setShowQuickUpdate(true),
    },
    {
      title: "Chiều cao hiện tại",
      value: babyStats.height,
      icon: Ruler,
      color: "text-green-600",
      change: "+1cm tuần này",
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
      value: babyStats.notes.toString(),
      icon: BookOpen,
      color: "text-orange-600",
      change: "+3 tuần này",
    },
  ]

  const siblings = [
    {
      name: "Bé An",
      age: "2 tuổi 4 tháng",
      avatar: "/placeholder.svg?height=40&width=40",
      recentActivity: "Thêm ảnh 1 giờ trước",
    },
    {
      name: "Bé Khôi",
      age: "1 tuổi",
      avatar: "/placeholder.svg?height=40&width=40",
      recentActivity: "Ghi chú phát triển 2 ngày trước",
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

  // Cập nhật hàm handleAddActivity để hiện toast
  const handleAddActivity = (newActivity: Omit<Activity, "id" | "time">) => {
    const activity: Activity = {
      ...newActivity,
      id: Date.now().toString(),
      time: formatTimeAgo(newActivity.date),
    }
    setActivities([activity, ...activities])

    // Hiện toast thành công
    toast({
      title: "Thêm hoạt động thành công! 🎉",
      description: `Đã thêm "${newActivity.content}" vào nhật ký của ${currentBaby.name}`,
    })
  }

  // Cập nhật hàm handleUpdateActivity để hiện toast
  const handleUpdateActivity = (updatedActivity: Activity | Omit<Activity, "id" | "time">) => {
    // If updatedActivity does not have id/time, use editingActivity as base
    if (!('id' in updatedActivity) && editingActivity) {
      const fullActivity: Activity = {
        ...editingActivity,
        ...updatedActivity,
        time: formatTimeAgo(editingActivity.date),
      }
      setActivities(
        activities.map((activity) =>
          activity.id === fullActivity.id
            ? { ...fullActivity, time: formatTimeAgo(fullActivity.date) }
            : activity,
        ),
      )
      setEditingActivity(null)

      // Hiện toast thành công
      toast({
        title: "Cập nhật hoạt động thành công! ✅",
        description: `Đã cập nhật "${fullActivity.content}"`,
      })
    } else if ('id' in updatedActivity) {
      setActivities(
        activities.map((activity) =>
          activity.id === updatedActivity.id
            ? { ...updatedActivity, time: formatTimeAgo(updatedActivity.date) }
            : activity,
        ),
      )
      setEditingActivity(null)

      // Hiện toast thành công
      toast({
        title: "Cập nhật hoạt động thành công! ✅",
        description: `Đã cập nhật "${updatedActivity.content}"`,
      })
    }
  }

  // Cập nhật hàm handleDeleteActivity để dùng dialog
  const handleDeleteActivity = (id: string) => {
    const activity = activities.find((a) => a.id === id)
    if (activity) {
      setDeleteDialog({
        isOpen: true,
        type: "activity",
        id,
        title: activity.content,
      })
    }
  }

  // Hàm xác nhận xóa activity
  const confirmDeleteActivity = () => {
    setActivities(activities.filter((activity) => activity.id !== deleteDialog.id))
    setDeleteDialog({ isOpen: false, type: "activity", id: "", title: "" })

    // Hiện toast thành công
    toast({
      title: "Đã xóa hoạt động! 🗑️",
      description: "Hoạt động đã được xóa khỏi nhật ký",
      variant: "destructive",
    })
  }

  // Cập nhật hàm handleAddEvent để hiện toast
  const handleAddEvent = (newEvent: Omit<Event, "id">) => {
    const event: Event = {
      ...newEvent,
      id: Date.now().toString(),
    }
    setEvents([...events, event])

    // Hiện toast thành công
    toast({
      title: "Thêm sự kiện thành công! 📅",
      description: `Đã thêm sự kiện "${newEvent.title}" vào lịch`,
    })
  }

  // Cập nhật hàm handleUpdateEvent để hiện toast
  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
    setEditingEvent(null)

    // Hiện toast thành công
    toast({
      title: "Cập nhật sự kiện thành công! ✅",
      description: `Đã cập nhật sự kiện "${updatedEvent.title}"`,
    })
  }

  // Cập nhật hàm handleDeleteEvent để dùng dialog
  const handleDeleteEvent = (id: string) => {
    const event = events.find((e) => e.id === id)
    if (event) {
      setDeleteDialog({
        isOpen: true,
        type: "event",
        id,
        title: event.title,
      })
    }
  }

  // Hàm xác nhận xóa event
  const confirmDeleteEvent = () => {
    setEvents(events.filter((event) => event.id !== deleteDialog.id))
    setDeleteDialog({ isOpen: false, type: "event", id: "", title: "" })

    // Hiện toast thành công
    toast({
      title: "Đã xóa sự kiện! 🗑️",
      description: "Sự kiện đã được xóa khỏi lịch",
      variant: "destructive",
    })
  }

  // Cập nhật hàm handleQuickUpdate để hiện toast
  const handleQuickUpdate = (data: { weight?: string; height?: string }) => {
    setBabyStats((prev) => ({
      ...prev,
      weight: data.weight ? `${data.weight} kg` : prev.weight,
      height: data.height ? `${data.height} cm` : prev.height,
    }))

    // Add activity for the update
    const updateContent = []
    if (data.weight) updateContent.push(`cân nặng: ${data.weight}kg`)
    if (data.height) updateContent.push(`chiều cao: ${data.height}cm`)

    if (updateContent.length > 0) {
      handleAddActivity({
        type: "health",
        content: `Cập nhật ${updateContent.join(", ")}`,
        icon: "Heart",
        date: new Date().toISOString(),
      })
    }

    // Hiện toast thành công
    toast({
      title: "Cập nhật thông số thành công! 📏",
      description: `Đã cập nhật ${updateContent.join(", ")} cho ${currentBaby.name}`,
    })
  }

  // Update time ago for activities every minute
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

  // Hiển thị loading state cho đến khi tất cả dữ liệu được load
  if (!activitiesMounted || !eventsMounted || !statsMounted) {
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

  return (
    <div className="space-y-6">
      {/* Welcome Section with Current Baby */}
      <Card className="bg-gradient-to-r from-blue-50 to-pink-50 border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={currentBaby.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                {currentBaby.name.split(" ")[1]?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Chào mừng trở lại! </h1>
              <p className="text-gray-600 mb-2">
                Hôm nay {currentBaby.name} đã {currentBaby.age} tuổi
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Cake className="h-4 w-4" />
                  Sinh ngày {currentBaby.birthDate}
                </span>
                <Badge variant="outline" className="bg-white">
                  {currentBaby.gender === "boy" ? "Bé trai" : "Bé gái"}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowQuickUpdate(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Cập nhật nhanh
              </Button>
              <Button className="hidden sm:flex" onClick={() => setShowAddActivity(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm hoạt động
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
                Hoạt động gần đây - {currentBaby.name}
              </CardTitle>
              <Button size="sm" onClick={() => setShowAddActivity(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm
              </Button>
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
              activities.map((activity) => {
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
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setEditingActivity(activity)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteActivity(activity.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
            <Button variant="outline" className="w-full">
              Xem tất cả hoạt động ({activities.length})
            </Button>
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
              <Button
                size="sm"
                onClick={() => setEditingEvent({ id: "", title: "", date: "", type: "activity", priority: "normal" })}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Chưa có sự kiện nào</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setEditingEvent({ id: "", title: "", date: "", type: "activity", priority: "normal" })}
                >
                  Thêm sự kiện đầu tiên
                </Button>
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-blue-50 group">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600">{event.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        event.type === "health" ? "destructive" : event.type === "milestone" ? "default" : "secondary"
                      }
                    >
                      {event.type === "health" ? "Sức khỏe" : event.type === "milestone" ? "Cột mốc" : "Hoạt động"}
                    </Badge>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setEditingEvent(event)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
            <Button variant="outline" className="w-full">
              Xem lịch đầy đủ ({events.length})
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Other Children Summary */}
      {siblings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Các bé khác trong gia đình
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {siblings.map((sibling, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={sibling.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-pink-100 text-pink-600">
                      {sibling.name.split(" ")[1]?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{sibling.name}</p>
                    <p className="text-sm text-gray-600">{sibling.age}</p>
                    <p className="text-xs text-gray-500">{sibling.recentActivity}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Xem
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh cho {currentBaby.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col gap-2" onClick={() => setShowAddActivity(true)}>
              <Camera className="h-6 w-6" />
              Thêm ảnh
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => setShowAddActivity(true)}>
              <BookOpen className="h-6 w-6" />
              Ghi nhật ký
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => setShowQuickUpdate(true)}>
              <Weight className="h-6 w-6" />
              Cập nhật cân nặng
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="h-6 w-6" />
              Chia sẻ
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <QuickUpdateModal
        isOpen={showQuickUpdate}
        onClose={() => setShowQuickUpdate(false)}
        babyName={currentBaby.name}
        currentWeight={currentBaby.weight}
        currentHeight={currentBaby.height}
        onUpdate={handleQuickUpdate}
      />

      <AddActivityModal
        isOpen={showAddActivity || editingActivity !== null}
        onClose={() => {
          setShowAddActivity(false)
          setEditingActivity(null)
        }}
        onSave={editingActivity ? handleUpdateActivity : handleAddActivity}
        editingActivity={editingActivity}
        babyName={currentBaby.name}
      />

      <AddEventModal
        isOpen={editingEvent !== null}
        onClose={() => setEditingEvent(null)}
        onSave={editingEvent?.id ? handleUpdateEvent : handleAddEvent}
        editingEvent={editingEvent}
      />

      {/* Thêm AlertDialog vào cuối component trước closing div */}
      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, isOpen: open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa {deleteDialog.type === "activity" ? "hoạt động" : "sự kiện"} này không?
              <br />
              <strong>"{deleteDialog.title}"</strong>
              <br />
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteDialog.type === "activity" ? confirmDeleteActivity : confirmDeleteEvent}
              className="bg-red-600 hover:bg-red-700"
            >
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
    date: "",
    type: "activity",
    priority: "normal",
    description: "",
  })

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title || "",
        date: editingEvent.date || "",
        type: editingEvent.type || "activity",
        priority: editingEvent.priority || "normal",
        description: editingEvent.description || "",
      })
    } else {
      setFormData({
        title: "",
        date: "",
        type: "activity",
        priority: "normal",
        description: "",
      })
    }
  }, [editingEvent])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingEvent?.id) {
      onSave({ ...editingEvent, ...formData })
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
          <h2 className="text-xl font-bold mb-4">{editingEvent?.id ? "Chỉnh sửa sự kiện" : "Thêm sự kiện mới"}</h2>
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
              <label className="block text-sm font-medium mb-2">Ngày *</label>
              <input
                type="date"
                required
                className="w-full p-2 border rounded-md"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Loại sự kiện</label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="activity">Hoạt động</option>
                <option value="health">Sức khỏe</option>
                <option value="milestone">Cột mốc</option>
              </select>
            </div>
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                {editingEvent?.id ? "Cập nhật" : "Thêm"}
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
