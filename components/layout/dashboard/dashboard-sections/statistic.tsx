import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Camera, BookOpen, Heart, Calendar } from "lucide-react"

export function StatisticsSection() {
  const monthlyStats = [
    { month: "T7", photos: 45, notes: 8, health: 2 },
    { month: "T8", photos: 52, notes: 6, health: 1 },
    { month: "T9", photos: 38, notes: 9, health: 2 },
    { month: "T10", photos: 41, notes: 7, health: 1 },
    { month: "T11", photos: 35, notes: 5, health: 2 },
    { month: "T12", photos: 36, notes: 7, health: 1 },
  ]

  const growthData = [
    { age: "6 tháng", weight: 7.2, height: 65 },
    { age: "7 tháng", weight: 7.8, height: 67 },
    { age: "8 tháng", weight: 8.2, height: 69 },
  ]

  const milestones = [
    { milestone: "Lật người", achieved: true, expectedAge: "4-6 tháng", actualAge: "5 tháng" },
    { milestone: "Ngồi không tựa", achieved: true, expectedAge: "6-8 tháng", actualAge: "7 tháng" },
    { milestone: "Bò", achieved: false, expectedAge: "7-10 tháng", actualAge: "-" },
    { milestone: "Đứng có tựa", achieved: false, expectedAge: "8-12 tháng", actualAge: "-" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Thống kê phát triển</h1>
        <p className="text-gray-600 mt-2">Theo dõi sự phát triển của bé qua các chỉ số</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="growth">Tăng trưởng</TabsTrigger>
          <TabsTrigger value="milestones">Cột mốc</TabsTrigger>
          <TabsTrigger value="activities">Hoạt động</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng ảnh</p>
                    <p className="text-2xl font-bold text-gray-900">247</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +12% so với tháng trước
                    </p>
                  </div>
                  <Camera className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ghi chú</p>
                    <p className="text-2xl font-bold text-gray-900">42</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +8% so với tháng trước
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Khám sức khỏe</p>
                    <p className="text-2xl font-bold text-gray-900">9</p>
                    <p className="text-xs text-gray-600">Đều đặn mỗi tháng</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hoạt động</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                    <p className="text-xs text-blue-600">Trung bình 5/ngày</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Hoạt động theo tháng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyStats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium">{stat.month}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 text-xs text-gray-600">Ảnh</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(stat.photos / 60) * 100}%` }}
                          />
                        </div>
                        <div className="w-8 text-xs font-medium">{stat.photos}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 text-xs text-gray-600">Ghi chú</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(stat.notes / 10) * 100}%` }}
                          />
                        </div>
                        <div className="w-8 text-xs font-medium">{stat.notes}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 text-xs text-gray-600">Sức khỏe</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${(stat.health / 3) * 100}%` }}
                          />
                        </div>
                        <div className="w-8 text-xs font-medium">{stat.health}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Biểu đồ tăng trưởng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4">Cân nặng (kg)</h3>
                    <div className="space-y-3">
                      {growthData.map((data, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium">{data.age}</span>
                          <span className="text-lg font-bold text-blue-600">{data.weight} kg</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-4">Chiều cao (cm)</h3>
                    <div className="space-y-3">
                      {growthData.map((data, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium">{data.age}</span>
                          <span className="text-lg font-bold text-green-600">{data.height} cm</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Ghi chú:</strong> Bé đang phát triển bình thường theo biểu đồ tăng trưởng WHO. Cân nặng và
                    chiều cao đều trong khoảng bình thường.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Các cột mốc phát triển</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{milestone.milestone}</h3>
                      <p className="text-sm text-gray-600">Tuổi dự kiến: {milestone.expectedAge}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{milestone.achieved ? milestone.actualAge : "Chưa đạt"}</p>
                      </div>
                      <Badge variant={milestone.achieved ? "default" : "secondary"}>
                        {milestone.achieved ? "Đã đạt" : "Chưa đạt"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động yêu thích</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Chơi với đồ chơi</span>
                    <Badge>35%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Nghe nhạc</span>
                    <Badge>28%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tắm</span>
                    <Badge>20%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Đọc sách</span>
                    <Badge>17%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thời gian hoạt động</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Sáng (6h-12h)</span>
                    <Badge variant="outline">4.5h</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Chiều (12h-18h)</span>
                    <Badge variant="outline">3.2h</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tối (18h-22h)</span>
                    <Badge variant="outline">2.8h</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ngủ (22h-6h)</span>
                    <Badge variant="outline">8h</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
