"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Save } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface QuickUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  baby: {
    _id: string
    name: string
    firstName?: string
    lastName?: string
    dob: string
    gender?: "Male" | "Female"
    avatar?: string
  }
  onUpdate?: (data: {
    firstName?: string
    lastName?: string
    gender?: "Male" | "Female"
    avatar?: string
    dob?: string
  }) => void
}

export function QuickUpdateModal({
  isOpen,
  onClose,
  baby,
  onUpdate,
}: Readonly<QuickUpdateModalProps>) {
  const [formData, setFormData] = useState({
    firstName: baby.firstName || "",
    lastName: baby.lastName || "",
    gender: baby.gender || "Male",
    avatar: baby.avatar || "",
    dob: baby.dob || ""
  })

  // Cập nhật hàm handleSubmit để hiện toast
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate data
    if (!formData.firstName && !formData.lastName) {
      toast({
        title: "Lỗi nhập liệu",
        description: "Vui lòng nhập ít nhất họ hoặc tên",
        variant: "destructive",
      })
      return
    }

    // Call onUpdate callback if provided
    if (onUpdate) {
      onUpdate({
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        avatar: formData.avatar,
        dob: formData.dob
      })
    }

    // Hiện toast thành công
    toast({
      title: "Cập nhật thành công! �",
      description: `Đã cập nhật thông tin cho bé ${formData.firstName}`,
    })

    onClose()
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      firstName: baby.firstName || "",
      lastName: baby.lastName || "",
      gender: baby.gender || "Male",
      avatar: baby.avatar || "",
      dob: baby.dob || ""
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Cập nhật thông tin - {baby.name}</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Họ</label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Nguyễn"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">Tên</label>
                <Input
                  id="firstName"
                  type="text"
                  required
                  placeholder="An"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
              <select
                id="gender"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as "Male" | "Female" })}
              >
                <option value="Male">Bé trai</option>
                <option value="Female">Bé gái</option>
              </select>
            </div>

            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
              <Input
                id="avatar"
                type="text"
                placeholder="URL ảnh đại diện"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Lưu thông tin
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
