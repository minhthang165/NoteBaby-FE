import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Heart, BookOpen, Calendar, TrendingUp, Users, ImageIcon, Clock, Cake, Edit, Ruler, Weight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { QuickUpdateModal } from "../quick-update-modal"
import { useState } from 'react';

export function OverviewSection() {
  const [showQuickUpdate, setShowQuickUpdate] = useState(false)

  // Mock data cho bé hiện tại
  const currentBaby = {
    name: "Bé Minh",
    age: "8 tháng 15 ngày",
    birthDate: "15/04/2024",
    avatar: "/placeholder.svg?height=60&width=60",
    gender: "boy",
    weight: "8.2 kg",
    height: "69 cm",
  }

  const stats = [
    {
      title: "Cân nặng hiện tại",
      value: currentBaby.weight,
      icon: Weight,
      color: "text-blue-600",
      change: "+0.3kg tuần này",
      action: () => setShowQuickUpdate(true),
    },
    {
      title: "Chiều cao hiện tại",
      value: currentBaby.height,
      icon: Ruler,
      color: "text-green-600",
      change: "+1cm tuần này",
      action: () => setShowQuickUpdate(true),
    },
    { title: "Tổng số ảnh", value: "247", icon: ImageIcon, color: "text-purple-600", change: "+12 tuần này" },
    { title: "Ghi chú phát triển", value: "32", icon: BookOpen, color: "text-orange-600", change: "+3 tuần này" },
  ]

  const recentActivities = [
    { type: "photo", content: "Thêm 5 ảnh mới vào album 'Tháng 12'", time: "2 giờ trước", icon: Camera },
    { type: "milestone", content: "Bé đã biết nói từ 'mama'", time: "1 ngày trước", icon: BookOpen },
    { type: "health", content: "Cập nhật cân nặng: 8.2kg", time: "3 ngày trước", icon: Heart },
    { type: "schedule", content: "Thêm lịch học bơi vào thứ 7", time: "1 tuần trước", icon: Calendar },
  ]

  const upcomingEvents = [
    { title: "Khám định kỳ", date: "25/12/2024", type: "health", priority: "high" },
    { title: "Học bơi", date: "28/12/2024", type: "activity", priority: "normal" },
    { title: "Sinh nhật bé", date: "15/04/2025", type: "milestone", priority: "high" },
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
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Chào mừng trở lại! 👋</h1>
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
              <Button className="hidden sm:flex">
                <Camera className="h-4 w-4 mr-2" />
                Thêm kỷ niệm
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
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Hoạt động gần đây - {currentBaby.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon
              return (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <Icon className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.content}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              )
            })}
            <Button variant="outline" className="w-full">
              Xem tất cả hoạt động
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Sự kiện sắp tới
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-600">{event.date}</p>
                </div>
                <Badge
                  variant={
                    event.type === "health" ? "destructive" : event.type === "milestone" ? "default" : "secondary"
                  }
                >
                  {event.type === "health" ? "Sức khỏe" : event.type === "milestone" ? "Cột mốc" : "Hoạt động"}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Xem lịch đầy đủ
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
            <Button className="h-20 flex flex-col gap-2">
              <Camera className="h-6 w-6" />
              Thêm ảnh
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
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

      {/* Quick Update Modal */}
      <QuickUpdateModal
        isOpen={showQuickUpdate}
        onClose={() => setShowQuickUpdate(false)}
        babyName={currentBaby.name}
        currentWeight={currentBaby.weight}
        currentHeight={currentBaby.height}
      />
    </div>
  )
}