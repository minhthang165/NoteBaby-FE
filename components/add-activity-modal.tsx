"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Camera, BookOpen, Heart, Calendar, Upload, ImageIcon, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Activity } from "lucide-react"

interface ActivityType {
  id: string
  type: string
  content: string
  time: string
  icon: string
  date: string
  images?: File[]
}

interface AddActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (activity: Omit<ActivityType, "id" | "time"> | ActivityType) => void
  editingActivity?: ActivityType | null
  babyName: string
}

export function AddActivityModal({ isOpen, onClose, onSave, editingActivity, babyName }: AddActivityModalProps) {
  const [formData, setFormData] = useState({
    type: "photo",
    content: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    icon: "Camera",
  })

  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  // Activity types với icons
  const activityTypes = [
    { value: "photo", label: "Thêm ảnh", icon: Camera, color: "bg-purple-100 text-purple-600" },
    { value: "milestone", label: "Cột mốc phát triển", icon: BookOpen, color: "bg-green-100 text-green-600" },
    { value: "health", label: "Sức khỏe", icon: Heart, color: "bg-red-100 text-red-600" },
    { value: "schedule", label: "Lịch trình", icon: Calendar, color: "bg-blue-100 text-blue-600" },
    { value: "note", label: "Ghi chú", icon: FileText, color: "bg-yellow-100 text-yellow-600" },
    { value: "activity", label: "Hoạt động", icon: Activity, color: "bg-orange-100 text-orange-600" },
  ]

  // Reset form khi modal đóng/mở
  useEffect(() => {
    if (isOpen) {
      if (editingActivity) {
        setFormData({
          type: editingActivity.type,
          content: editingActivity.content,
          date: new Date(editingActivity.date).toISOString().split("T")[0],
          notes: "",
          icon: editingActivity.icon,
        })
      } else {
        setFormData({
          type: "photo",
          content: "",
          date: new Date().toISOString().split("T")[0],
          notes: "",
          icon: "Camera",
        })
      }
      setSelectedImages([])
      setPreviewUrls([])
    }
  }, [isOpen, editingActivity])

  // Cleanup preview URLs khi component unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  const handleTypeChange = (type: string) => {
    const selectedType = activityTypes.find((t) => t.value === type)
    setFormData({
      ...formData,
      type,
      icon: selectedType?.icon.name || "Camera",
    })
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    // Validate files
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Lỗi định dạng file",
          description: `File "${file.name}" không phải là ảnh`,
          variant: "destructive",
        })
        return false
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        toast({
          title: "File quá lớn",
          description: `File "${file.name}" vượt quá 10MB`,
          variant: "destructive",
        })
        return false
      }

      return true
    })

    if (validFiles.length > 0) {
      setSelectedImages((prev) => [...prev, ...validFiles])

      // Create preview URLs
      const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls])

      toast({
        title: "Đã chọn ảnh thành công! 📸",
        description: `Đã chọn ${validFiles.length} ảnh`,
      })
    }
  }

  const removeImage = (index: number) => {
    // Revoke URL to prevent memory leak
    URL.revokeObjectURL(previewUrls[index])

    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.content.trim()) {
      toast({
        title: "Lỗi nhập liệu",
        description: "Vui lòng nhập nội dung hoạt động",
        variant: "destructive",
      })
      return
    }

    // Tạo content dựa trên type
    let content = formData.content
    if (formData.type === "photo" && selectedImages.length > 0) {
      content = `Thêm ${selectedImages.length} ảnh mới: ${formData.content}`
    }

    const activityData = {
      type: formData.type,
      content,
      date: new Date(formData.date).toISOString(),
      icon: formData.icon,
      images: selectedImages,
    }

    if (editingActivity) {
      onSave({ ...editingActivity, ...activityData })
    } else {
      onSave(activityData)
    }

    handleClose()
  }

  const handleClose = () => {
    // Cleanup preview URLs
    previewUrls.forEach((url) => URL.revokeObjectURL(url))
    setSelectedImages([])
    setPreviewUrls([])
    onClose()
  }

  if (!isOpen) return null

  const selectedType = activityTypes.find((t) => t.value === formData.type)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {editingActivity ? "Chỉnh sửa hoạt động" : "Thêm hoạt động mới"} - {babyName}
          </h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Activity Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Loại hoạt động *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {activityTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeChange(type.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.type === type.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${type.color} flex items-center justify-center mx-auto mb-2`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-medium text-center">{type.label}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Image Upload - chỉ hiện khi type = photo */}
          {formData.type === "photo" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Chọn ảnh</label>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium text-blue-600">Click để chọn ảnh</span> hoặc kéo thả vào đây
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB mỗi file</p>
                </label>
              </div>

              {/* Image Previews */}
              {selectedImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Đã chọn {selectedImages.length} ảnh</p>
                  <div className="grid grid-cols-3 gap-3">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                          {(selectedImages[index].size / 1024 / 1024).toFixed(1)}MB
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung hoạt động *</label>
            <Input
              type="text"
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder={
                formData.type === "photo"
                  ? "VD: Ảnh bé chơi ở công viên"
                  : formData.type === "milestone"
                    ? "VD: Bé đã biết nói từ 'mama'"
                    : formData.type === "health"
                      ? "VD: Cập nhật cân nặng 8.5kg"
                      : "VD: Mô tả hoạt động..."
              }
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày *</label>
            <Input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú thêm</label>
            <Textarea
              placeholder="Ghi chú chi tiết về hoạt động..."
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Preview */}
          {selectedType && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${selectedType.color} flex items-center justify-center`}>
                    <selectedType.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{formData.content || "Nội dung hoạt động..."}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{selectedType.label}</Badge>
                      {selectedImages.length > 0 && (
                        <Badge variant="outline" className="text-purple-600">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          {selectedImages.length} ảnh
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button type="submit" className="flex-1">
              {editingActivity ? "Cập nhật" : "Thêm hoạt động"}
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

