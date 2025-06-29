import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from 'react';
import {
  Heart,
  Plus,
  Calendar,
  Weight,
  Ruler,
  Stethoscope,
  Pill,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  X,
} from "lucide-react"

const AddHealthRecordModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    type: "",
    date: "",
    time: "",
    doctor: "",
    hospital: "",
    weight: "",
    height: "",
    temperature: "",
    symptoms: "",
    diagnosis: "",
    treatment: "",
    vaccine: "",
    notes: "",
    nextAppointment: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Xử lý lưu dữ liệu
    console.log("Health record data:", formData)
    alert("Hồ sơ khám đã được lưu thành công!")
    onClose()
  }

  const resetForm = () => {
    setFormData({
      type: "",
      date: "",
      time: "",
      doctor: "",
      hospital: "",
      weight: "",
      height: "",
      temperature: "",
      symptoms: "",
      diagnosis: "",
      treatment: "",
      vaccine: "",
      notes: "",
      nextAppointment: "",
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Thêm hồ sơ khám mới</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Thông tin cơ bản */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loại khám *</label>
                <select
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="">Chọn loại khám</option>
                  <option value="checkup">Khám định kỳ</option>
                  <option value="vaccine">Tiêm vaccine</option>
                  <option value="sick">Khám bệnh</option>
                  <option value="emergency">Cấp cứu</option>
                  <option value="specialist">Khám chuyên khoa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày khám *</label>
                <Input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giờ khám</label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bác sĩ</label>
                <Input
                  placeholder="Tên bác sĩ"
                  value={formData.doctor}
                  onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bệnh viện/Phòng khám</label>
              <Input
                placeholder="Tên bệnh viện hoặc phòng khám"
                value={formData.hospital}
                onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
              />
            </div>
          </div>

          {/* Chỉ số sức khỏe */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Chỉ số sức khỏe</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cân nặng (kg)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="8.2"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chiều cao (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="69"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nhiệt độ (°C)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="36.5"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Thông tin khám bệnh */}
          {(formData.type === "sick" || formData.type === "emergency") && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Thông tin khám bệnh</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Triệu chứng</label>
                  <Textarea
                    placeholder="Mô tả các triệu chứng của bé..."
                    rows={3}
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chẩn đoán</label>
                  <Input
                    placeholder="Chẩn đoán của bác sĩ"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Điều trị</label>
                  <Textarea
                    placeholder="Phương pháp điều trị, thuốc men..."
                    rows={3}
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Thông tin vaccine */}
          {formData.type === "vaccine" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Thông tin tiêm chủng</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loại vaccine</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.vaccine}
                  onChange={(e) => setFormData({ ...formData, vaccine: e.target.value })}
                >
                  <option value="">Chọn loại vaccine</option>
                  <option value="bcg">BCG</option>
                  <option value="hepatitis-b">Viêm gan B</option>
                  <option value="5-in-1">Vaccine 5 trong 1</option>
                  <option value="pneumococcal">Phế cầu khuẩn</option>
                  <option value="rotavirus">Rotavirus</option>
                  <option value="measles-rubella">Sởi - Rubella</option>
                  <option value="hepatitis-a">Viêm gan A</option>
                  <option value="varicella">Thủy đậu</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>
          )}

          {/* Ghi chú */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ghi chú và theo dõi</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú của bác sĩ</label>
                <Textarea
                  placeholder="Lời khuyên, chú ý đặc biệt từ bác sĩ..."
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lịch hẹn tiếp theo</label>
                <Input
                  type="date"
                  value={formData.nextAppointment}
                  onChange={(e) => setFormData({ ...formData, nextAppointment: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button type="submit" className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Lưu hồ sơ khám
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Trong component HealthSection, thêm state để quản lý modal
export function HealthSection() {
  const [showAddModal, setShowAddModal] = useState(false)

  const healthRecords = [
    {
      id: 1,
      date: "15/12/2024",
      type: "Khám định kỳ",
      doctor: "BS. Nguyễn Thị Lan",
      hospital: "Bệnh viện Nhi Trung ương",
      weight: 8.2,
      height: 69,
      notes: "Bé phát triển bình thường, cần tiêm vaccine tiếp theo vào tháng sau",
      status: "normal",
    },
    {
      id: 2,
      date: "20/11/2024",
      type: "Tiêm vaccine",
      doctor: "BS. Trần Văn Nam",
      hospital: "Trung tâm Y tế Quận 1",
      vaccine: "Vaccine 5 trong 1 (mũi 3)",
      notes: "Tiêm vaccine thành công, bé có phản ứng nhẹ sau tiêm",
      status: "completed",
    },
    {
      id: 3,
      date: "05/11/2024",
      type: "Khám bệnh",
      doctor: "BS. Lê Thị Hoa",
      hospital: "Phòng khám Nhi khoa ABC",
      symptoms: "Sốt nhẹ, ho",
      diagnosis: "Viêm đường hô hấp trên",
      treatment: "Thuốc hạ sốt, thuốc ho",
      status: "recovered",
    },
  ]

  const vaccineSchedule = [
    { vaccine: "BCG", age: "Sơ sinh", status: "completed", date: "15/04/2024" },
    { vaccine: "Viêm gan B (mũi 1)", age: "Sơ sinh", status: "completed", date: "15/04/2024" },
    { vaccine: "5 trong 1 (mũi 1)", age: "2 tháng", status: "completed", date: "15/06/2024" },
    { vaccine: "5 trong 1 (mũi 2)", age: "3 tháng", status: "completed", date: "15/07/2024" },
    { vaccine: "5 trong 1 (mũi 3)", age: "4 tháng", status: "completed", date: "20/11/2024" },
    { vaccine: "Sởi - Rubella", age: "9 tháng", status: "upcoming", date: "15/01/2025" },
    { vaccine: "Viêm gan A", age: "12 tháng", status: "upcoming", date: "15/04/2025" },
  ]

  const growthChart = [
    { age: "Sơ sinh", weight: 3.2, height: 50 },
    { age: "1 tháng", weight: 4.1, height: 54 },
    { age: "2 tháng", weight: 5.2, height: 58 },
    { age: "3 tháng", weight: 6.0, height: 61 },
    { age: "4 tháng", weight: 6.8, height: 63 },
    { age: "5 tháng", weight: 7.2, height: 65 },
    { age: "6 tháng", weight: 7.6, height: 67 },
    { age: "7 tháng", weight: 7.9, height: 68 },
    { age: "8 tháng", weight: 8.2, height: 69 },
  ]

  const upcomingAppointments = [
    {
      date: "25/12/2024",
      time: "09:00",
      type: "Khám định kỳ",
      doctor: "BS. Nguyễn Thị Lan",
      hospital: "Bệnh viện Nhi Trung ương",
    },
    {
      date: "15/01/2025",
      time: "14:30",
      type: "Tiêm vaccine",
      doctor: "BS. Trần Văn Nam",
      hospital: "Trung tâm Y tế Quận 1",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Theo dõi sức khỏe</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin sức khỏe và lịch khám của bé</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" />
          Thêm hồ sơ khám
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="records">Hồ sơ khám</TabsTrigger>
          <TabsTrigger value="vaccines">Tiêm chủng</TabsTrigger>
          <TabsTrigger value="growth">Tăng trưởng</TabsTrigger>
          <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Health Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cân nặng hiện tại</p>
                    <p className="text-2xl font-bold text-gray-900">8.2 kg</p>
                    <p className="text-xs text-green-600">Bình thường</p>
                  </div>
                  <Weight className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Chiều cao hiện tại</p>
                    <p className="text-2xl font-bold text-gray-900">69 cm</p>
                    <p className="text-xs text-green-600">Bình thường</p>
                  </div>
                  <Ruler className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lần khám gần nhất</p>
                    <p className="text-2xl font-bold text-gray-900">15/12</p>
                    <p className="text-xs text-blue-600">9 ngày trước</p>
                  </div>
                  <Stethoscope className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vaccine tiếp theo</p>
                    <p className="text-2xl font-bold text-gray-900">15/01</p>
                    <p className="text-xs text-orange-600">Sởi - Rubella</p>
                  </div>
                  <Pill className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Lịch hẹn sắp tới
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">{appointment.date}</p>
                        <p className="text-xs text-gray-600">{appointment.time}</p>
                      </div>
                      <div>
                        <p className="font-medium">{appointment.type}</p>
                        <p className="text-sm text-gray-600">{appointment.doctor}</p>
                        <p className="text-xs text-gray-500">{appointment.hospital}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Chi tiết
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Health Alerts */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Nhắc nhở:</strong> Bé cần tiêm vaccine Sởi - Rubella vào ngày 15/01/2025. Hãy đặt lịch hẹn với bác
              sĩ.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          <div className="space-y-4">
            {healthRecords.map((record) => (
              <Card key={record.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {record.type}
                        <Badge
                          variant={
                            record.status === "normal"
                              ? "default"
                              : record.status === "completed"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {record.status === "normal"
                            ? "Bình thường"
                            : record.status === "completed"
                              ? "Hoàn thành"
                              : "Đã khỏi"}
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {record.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {record.doctor}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{record.hospital}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {record.weight && record.height && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Weight className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Cân nặng: {record.weight} kg</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Chiều cao: {record.height} cm</span>
                      </div>
                    </div>
                  )}
                  {record.vaccine && (
                    <div className="mb-4">
                      <p className="text-sm font-medium">Vaccine: {record.vaccine}</p>
                    </div>
                  )}
                  {record.symptoms && (
                    <div className="mb-4">
                      <p className="text-sm font-medium">Triệu chứng: {record.symptoms}</p>
                      <p className="text-sm">Chẩn đoán: {record.diagnosis}</p>
                      <p className="text-sm">Điều trị: {record.treatment}</p>
                    </div>
                  )}
                  <p className="text-sm text-gray-700">{record.notes}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vaccines" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lịch tiêm chủng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vaccineSchedule.map((vaccine, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                        {vaccine.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{vaccine.vaccine}</p>
                        <p className="text-sm text-gray-600">Tuổi: {vaccine.age}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{vaccine.date}</p>
                      <Badge variant={vaccine.status === "completed" ? "default" : "secondary"}>
                        {vaccine.status === "completed" ? "Đã tiêm" : "Sắp tới"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Biểu đồ cân nặng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {growthChart.slice(-6).map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">{data.age}</span>
                      <span className="text-lg font-bold text-blue-600">{data.weight} kg</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Biểu đồ chiều cao</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {growthChart.slice(-6).map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">{data.age}</span>
                      <span className="text-lg font-bold text-green-600">{data.height} cm</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Heart className="h-4 w-4" />
            <AlertDescription>
              Bé đang phát triển rất tốt! Cân nặng và chiều cao đều nằm trong khoảng bình thường theo biểu đồ tăng
              trưởng WHO.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Đặt lịch hẹn mới</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại khám *</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Chọn loại khám</option>
                    <option value="checkup">Khám định kỳ</option>
                    <option value="vaccine">Tiêm chủng</option>
                    <option value="sick">Khám bệnh</option>
                    <option value="specialist">Khám chuyên khoa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hẹn *</label>
                  <Input type="date" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giờ hẹn *</label>
                  <Input type="time" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bác sĩ</label>
                  <Input placeholder="Tên bác sĩ" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bệnh viện/Phòng khám</label>
                <Input placeholder="Tên bệnh viện hoặc phòng khám" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                <Textarea placeholder="Ghi chú thêm về cuộc hẹn..." rows={3} />
              </div>

              <div className="flex gap-4">
                <Button className="flex-1">Đặt lịch hẹn</Button>
                <Button variant="outline">Hủy</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <AddHealthRecordModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  )
}
