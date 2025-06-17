import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  User,
  BookOpen,
  Music,
  Palette,
  Gamepad2,
  Baby,
  Edit,
  Trash2,
} from "lucide-react"

export function ScheduleSection() {
  const weeklySchedule = [
    {
      day: "Thứ 2",
      date: "23/12",
      activities: [
        {
          time: "09:00 - 10:00",
          title: "Học bơi",
          type: "sport",
          location: "Hồ bơi Aqua Kids",
          instructor: "Cô Lan",
          color: "bg-blue-100 text-blue-800",
        },
        {
          time: "15:00 - 16:00",
          title: "Khám định kỳ",
          type: "health",
          location: "Bệnh viện Nhi Trung ương",
          instructor: "BS. Nguyễn Thị Lan",
          color: "bg-red-100 text-red-800",
        },
      ],
    },
    {
      day: "Thứ 3",
      date: "24/12",
      activities: [
        {
          time: "10:00 - 11:00",
          title: "Học nhạc",
          type: "music",
          location: "Trung tâm âm nhạc Melody",
          instructor: "Cô Hương",
          color: "bg-purple-100 text-purple-800",
        },
      ],
    },
    {
      day: "Thứ 4",
      date: "25/12",
      activities: [
        {
          time: "14:00 - 15:30",
          title: "Học vẽ",
          type: "art",
          location: "Lớp học nghệ thuật Kids Art",
          instructor: "Cô Mai",
          color: "bg-green-100 text-green-800",
        },
      ],
    },
    {
      day: "Thứ 5",
      date: "26/12",
      activities: [
        {
          time: "09:30 - 10:30",
          title: "Yoga cho bé",
          type: "sport",
          location: "Yoga Studio Zen",
          instructor: "Cô Linh",
          color: "bg-blue-100 text-blue-800",
        },
        {
          time: "16:00 - 17:00",
          title: "Chơi nhóm",
          type: "social",
          location: "Khu vui chơi Happy Kids",
          instructor: "Cô Nga",
          color: "bg-yellow-100 text-yellow-800",
        },
      ],
    },
    {
      day: "Thứ 6",
      date: "27/12",
      activities: [
        {
          time: "10:00 - 11:00",
          title: "Đọc sách",
          type: "education",
          location: "Thư viện trẻ em",
          instructor: "Cô Thảo",
          color: "bg-indigo-100 text-indigo-800",
        },
      ],
    },
    {
      day: "Thứ 7",
      date: "28/12",
      activities: [
        {
          time: "09:00 - 10:30",
          title: "Bơi lội",
          type: "sport",
          location: "Hồ bơi Aqua Kids",
          instructor: "Thầy Nam",
          color: "bg-blue-100 text-blue-800",
        },
        {
          time: "15:00 - 16:00",
          title: "Tiệc sinh nhật bạn",
          type: "social",
          location: "Nhà bạn Minh An",
          instructor: "",
          color: "bg-pink-100 text-pink-800",
        },
      ],
    },
    {
      day: "Chủ nhật",
      date: "29/12",
      activities: [
        {
          time: "10:00 - 12:00",
          title: "Dã ngoại gia đình",
          type: "family",
          location: "Công viên Tao Đàn",
          instructor: "",
          color: "bg-orange-100 text-orange-800",
        },
      ],
    },
  ]

  const activityTypes = [
    { id: "sport", name: "Thể thao", icon: Gamepad2, color: "bg-blue-100 text-blue-800" },
    { id: "music", name: "Âm nhạc", icon: Music, color: "bg-purple-100 text-purple-800" },
    { id: "art", name: "Nghệ thuật", icon: Palette, color: "bg-green-100 text-green-800" },
    { id: "education", name: "Giáo dục", icon: BookOpen, color: "bg-indigo-100 text-indigo-800" },
    { id: "health", name: "Sức khỏe", icon: User, color: "bg-red-100 text-red-800" },
    { id: "social", name: "Xã hội", icon: Baby, color: "bg-yellow-100 text-yellow-800" },
    { id: "family", name: "Gia đình", icon: User, color: "bg-orange-100 text-orange-800" },
  ]

  const upcomingActivities = [
    {
      title: "Học bơi",
      date: "23/12/2024",
      time: "09:00",
      type: "sport",
      location: "Hồ bơi Aqua Kids",
    },
    {
      title: "Khám định kỳ",
      date: "23/12/2024",
      time: "15:00",
      type: "health",
      location: "Bệnh viện Nhi Trung ương",
    },
    {
      title: "Học nhạc",
      date: "24/12/2024",
      time: "10:00",
      type: "music",
      location: "Trung tâm âm nhạc Melody",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch học & Thời khóa biểu</h1>
          <p className="text-gray-600 mt-2">Quản lý lịch học và các hoạt động của bé</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm hoạt động
        </Button>
      </div>

      <Tabs defaultValue="weekly" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weekly">Lịch tuần</TabsTrigger>
          <TabsTrigger value="upcoming">Sắp diễn ra</TabsTrigger>
          <TabsTrigger value="add-activity">Thêm hoạt động</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-6">
          <div className="grid gap-4">
            {weeklySchedule.map((day, dayIndex) => (
              <Card key={dayIndex}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{day.day}</span>
                      <Badge variant="outline">{day.date}</Badge>
                    </div>
                    <span className="text-sm text-gray-600">{day.activities.length} hoạt động</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {day.activities.length > 0 ? (
                    <div className="space-y-3">
                      {day.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="text-center min-w-[80px]">
                              <p className="text-sm font-medium">{activity.time}</p>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">{activity.title}</h3>
                                <Badge className={activity.color}>
                                  {activityTypes.find((type) => type.id === activity.type)?.name}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {activity.location}
                                </span>
                                {activity.instructor && (
                                  <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {activity.instructor}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Không có hoạt động nào trong ngày này</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Thêm hoạt động
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Hoạt động sắp diễn ra
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[100px]">
                        <p className="text-sm font-medium">{activity.date}</p>
                        <p className="text-xs text-gray-600">{activity.time}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">{activity.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {activity.location}
                        </p>
                      </div>
                    </div>
                    <Badge className={activityTypes.find((type) => type.id === activity.type)?.color}>
                      {activityTypes.find((type) => type.id === activity.type)?.name}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activityTypes.map((type) => {
              const Icon = type.icon
              const count = weeklySchedule.reduce(
                (total, day) => total + day.activities.filter((activity) => activity.type === type.id).length,
                0,
              )
              return (
                <Card key={type.id}>
                  <CardContent className="p-4 text-center">
                    <Icon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-gray-600">{type.name}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="add-activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thêm hoạt động mới</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên hoạt động *</label>
                  <Input placeholder="VD: Học bơi" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại hoạt động *</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Chọn loại hoạt động</option>
                    {activityTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày *</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giờ bắt đầu *</label>
                  <Input type="time" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giờ kết thúc *</label>
                  <Input type="time" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm</label>
                  <Input placeholder="VD: Hồ bơi Aqua Kids" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giáo viên/Hướng dẫn viên</label>
                  <Input placeholder="VD: Cô Lan" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                <Textarea placeholder="Ghi chú thêm về hoạt động..." rows={3} />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Lặp lại hàng tuần</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Nhắc nhở trước 30 phút</span>
                </label>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1">Thêm hoạt động</Button>
                <Button variant="outline">Hủy</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt lịch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Thông báo</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>Nhắc nhở trước hoạt động 30 phút</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>Nhắc nhở trước hoạt động 1 ngày</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span>Gửi báo cáo tuần qua email</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Hiển thị</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>Hiển thị cuối tuần</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>Hiển thị hoạt động đã hủy</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span>Chế độ tối</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Xuất dữ liệu</h3>
                <div className="flex gap-4">
                  <Button variant="outline">Xuất PDF</Button>
                  <Button variant="outline">Xuất Excel</Button>
                  <Button variant="outline">Đồng bộ Google Calendar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
