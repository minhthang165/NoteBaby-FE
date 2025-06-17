import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Heart, BookOpen, Calendar, TrendingUp, Users, ImageIcon, Clock } from "lucide-react"

export function OverviewSection() {
  const stats = [
    { title: "Tổng số ảnh", value: "247", icon: ImageIcon, color: "text-blue-600" },
    { title: "Ghi chú phát triển", value: "32", icon: BookOpen, color: "text-green-600" },
    { title: "Lần khám sức khỏe", value: "8", icon: Heart, color: "text-red-600" },
    { title: "Hoạt động tuần này", value: "12", icon: TrendingUp, color: "text-purple-600" },
  ]

  const recentActivities = [
    { type: "photo", content: "Thêm 5 ảnh mới vào album 'Tháng 12'", time: "2 giờ trước", icon: Camera },
    { type: "milestone", content: "Bé đã biết nói từ 'mama'", time: "1 ngày trước", icon: BookOpen },
    { type: "health", content: "Cập nhật cân nặng: 8.2kg", time: "3 ngày trước", icon: Heart },
    { type: "schedule", content: "Thêm lịch học bơi vào thứ 7", time: "1 tuần trước", icon: Calendar },
  ]

  const upcomingEvents = [
    { title: "Khám định kỳ", date: "25/12/2024", type: "health" },
    { title: "Học bơi", date: "28/12/2024", type: "activity" },
    { title: "Sinh nhật bé", date: "05/01/2025", type: "milestone" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Chào mừng trở lại! 👋</h1>
        <p className="text-gray-600 mt-2">Hôm nay bé Minh đã 8 tháng 15 ngày tuổi</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
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
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Heart className="h-6 w-6" />
              Cập nhật sức khỏe
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="h-6 w-6" />
              Chia sẻ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
