import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Camera, Star, Calendar, Edit, Trash2 } from "lucide-react"

export function DevelopmentSection() {
  const milestones = [
    {
      id: 1,
      title: "Lần đầu lật người",
      date: "15/08/2024",
      age: "5 tháng",
      description: "Hôm nay bé đã tự lật từ ngửa sang nghiêng! Rất tự hào về con.",
      photos: 3,
      category: "Vận động",
      important: true,
    },
    {
      id: 2,
      title: "Nói từ đầu tiên: 'mama'",
      date: "22/09/2024",
      age: "6 tháng 1 tuần",
      description: "Bé đã nói 'mama' rất rõ ràng. Cả nhà đều vui mừng!",
      photos: 2,
      category: "Ngôn ngữ",
      important: true,
    },
    {
      id: 3,
      title: "Ngồi không cần tựa",
      date: "05/10/2024",
      age: "7 tháng",
      description: "Bé có thể ngồi vững vàng mà không cần tựa vào gì.",
      photos: 4,
      category: "Vận động",
      important: false,
    },
    {
      id: 4,
      title: "Ăn dặm lần đầu",
      date: "12/10/2024",
      age: "7 tháng 1 tuần",
      description: "Bé đã thử cháo tôm đầu tiên. Ban đầu hơi khó khăn nhưng sau đó bé ăn rất ngon.",
      photos: 5,
      category: "Dinh dưỡng",
      important: false,
    },
  ]

  const weeklyNotes = [
    {
      week: "Tuần 1 - Tháng 12",
      date: "01/12 - 07/12/2024",
      notes: ["Bé ngủ ngon hơn, ít thức đêm", "Thích chơi với đồ chơi có âm thanh", "Bắt đầu tỏ ra sợ người lạ"],
    },
    {
      week: "Tuần 2 - Tháng 12",
      date: "08/12 - 14/12/2024",
      notes: [
        "Bé cố gắng bò nhưng chưa thành công",
        "Rất thích nghe nhạc và vỗ tay theo nhịp",
        "Ăn dặm tốt hơn, ít kén ăn",
      ],
    },
  ]

  const categories = ["Tất cả", "Vận động", "Ngôn ngữ", "Dinh dưỡng", "Xã hội", "Khác"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nhật ký phát triển</h1>
          <p className="text-gray-600 mt-2">Ghi lại những cột mốc quan trọng trong sự phát triển của bé</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm cột mốc mới
        </Button>
      </div>

      <Tabs defaultValue="milestones" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="milestones">Cột mốc phát triển</TabsTrigger>
          <TabsTrigger value="weekly">Ghi chú hàng tuần</TabsTrigger>
          <TabsTrigger value="add-new">Thêm mới</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="space-y-6">
          {/* Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button key={category} variant="outline" size="sm">
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Milestones List */}
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <Card key={milestone.id} className={milestone.important ? "border-yellow-200 bg-yellow-50" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{milestone.title}</CardTitle>
                        {milestone.important && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {milestone.date}
                        </span>
                        <Badge variant="secondary">{milestone.age}</Badge>
                        <Badge variant="outline">{milestone.category}</Badge>
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
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{milestone.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Camera className="h-4 w-4" />
                      {milestone.photos} ảnh
                    </div>
                    <Button variant="outline" size="sm">
                      Xem chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <div className="space-y-6">
            {weeklyNotes.map((week, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{week.week}</span>
                    <span className="text-sm font-normal text-gray-600">{week.date}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {week.notes.map((note, noteIndex) => (
                      <li key={noteIndex} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{note}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="add-new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thêm cột mốc phát triển mới</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                  <Input placeholder="VD: Lần đầu bò" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày *</label>
                  <Input type="date" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tuổi của bé</label>
                  <Input placeholder="VD: 8 tháng 2 tuần" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Chọn danh mục</option>
                    <option value="movement">Vận động</option>
                    <option value="language">Ngôn ngữ</option>
                    <option value="nutrition">Dinh dưỡng</option>
                    <option value="social">Xã hội</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết</label>
                <Textarea
                  placeholder="Mô tả chi tiết về cột mốc này, cảm xúc của bạn và những điều đặc biệt..."
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Thêm ảnh
                </Button>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Đánh dấu là cột mốc quan trọng</span>
                </label>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1">Lưu cột mốc</Button>
                <Button variant="outline">Hủy</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
