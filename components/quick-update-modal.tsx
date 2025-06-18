"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Weight, Ruler, Save, TrendingUp } from "lucide-react"

// Thêm import cho toast
import { toast } from "@/hooks/use-toast"

interface QuickUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  babyName: string
  currentWeight?: string
  currentHeight?: string
  onUpdate?: (data: { weight?: string; height?: string }) => void
}

export function QuickUpdateModal({
  isOpen,
  onClose,
  babyName,
  currentWeight,
  currentHeight,
  onUpdate,
}: QuickUpdateModalProps) {
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    location: "home", // home, hospital, clinic
  })

  const [showComparison, setShowComparison] = useState(false)

  // Cập nhật hàm handleSubmit để hiện toast
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate data
    if (!formData.weight && !formData.height) {
      toast({
        title: "Lỗi nhập liệu",
        description: "Vui lòng nhập ít nhất cân nặng hoặc chiều cao",
        variant: "destructive",
      })
      return
    }

    // Call onUpdate callback if provided
    if (onUpdate) {
      onUpdate({
        weight: formData.weight || undefined,
        height: formData.height || undefined,
      })
    }

    // Hiện toast thành công
    const updateInfo = []
    if (formData.weight) updateInfo.push(`cân nặng ${formData.weight}kg`)
    if (formData.height) updateInfo.push(`chiều cao ${formData.height}cm`)

    toast({
      title: "Cập nhật thành công! 📏",
      description: `Đã cập nhật ${updateInfo.join(" và ")} cho ${babyName}`,
    })

    onClose()
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      weight: "",
      height: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
      location: "home",
    })
    setShowComparison(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  // Mock previous data for comparison
  const previousData = {
    weight: currentWeight?.replace(" kg", "") || "8.0",
    height: currentHeight?.replace(" cm", "") || "68",
    date: "15/11/2024",
  }

  const calculateChange = (current: string, previous: string) => {
    const diff = Number.parseFloat(current) - Number.parseFloat(previous)
    return diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Cập nhật nhanh - {babyName}</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current vs Previous */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Cân nặng hiện tại</p>
                  <p className="font-bold text-lg">{currentWeight || "8.2 kg"}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Chiều cao hiện tại</p>
                  <p className="font-bold text-lg">{currentHeight || "69 cm"}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Cập nhật lần cuối: {previousData.date}</p>
            </CardContent>
          </Card>

          {/* Update Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày đo *</label>
              <Input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Weight className="inline h-4 w-4 mr-1" />
                  Cân nặng (kg)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="8.5"
                  value={formData.weight}
                  onChange={(e) => {
                    setFormData({ ...formData, weight: e.target.value })
                    setShowComparison(e.target.value !== "")
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Ruler className="inline h-4 w-4 mr-1" />
                  Chiều cao (cm)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="70"
                  value={formData.height}
                  onChange={(e) => {
                    setFormData({ ...formData, height: e.target.value })
                    setShowComparison(e.target.value !== "")
                  }}
                />
              </div>
            </div>

            {/* Comparison */}
            {showComparison && (formData.weight || formData.height) && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">So sánh với lần trước</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {formData.weight && (
                      <div>
                        <p className="text-gray-600">Cân nặng</p>
                        <p className="font-bold">
                          {formData.weight} kg
                          <Badge variant="outline" className="ml-2 text-xs">
                            {calculateChange(formData.weight, previousData.weight)} kg
                          </Badge>
                        </p>
                      </div>
                    )}
                    {formData.height && (
                      <div>
                        <p className="text-gray-600">Chiều cao</p>
                        <p className="font-bold">
                          {formData.height} cm
                          <Badge variant="outline" className="ml-2 text-xs">
                            {calculateChange(formData.height, previousData.height)} cm
                          </Badge>
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nơi đo</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              >
                <option value="home">Tại nhà</option>
                <option value="hospital">Bệnh viện</option>
                <option value="clinic">Phòng khám</option>
                <option value="pharmacy">Nhà thuốc</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
              <Textarea
                placeholder="Ghi chú thêm về tình trạng của bé..."
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          {/* Tips */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-yellow-800 mb-2">💡 Mẹo đo chính xác:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Cân bé vào cùng thời điểm trong ngày</li>
                <li>• Đo chiều cao khi bé nằm thẳng, chân duỗi</li>
                <li>• Cân khi bé đói, trước khi ăn</li>
                <li>• Ghi lại ngay để không quên</li>
              </ul>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Lưu cập nhật
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
