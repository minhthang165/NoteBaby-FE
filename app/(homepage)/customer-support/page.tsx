"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageCircle,
  Mail,
  Phone,
  Clock,
  HelpCircle,
  Send,
  CheckCircle,
  AlertCircle,
  Book,
  Camera,
  Share2,
  CreditCard,
  Settings,
  Shield,
} from "lucide-react"

export default function CustomerSupport() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  })

  const supportCategories = [
    { id: "account", name: "Tài khoản", icon: Settings, color: "bg-blue-100 text-blue-800" },
    { id: "content", name: "Nội dung & Ảnh", icon: Camera, color: "bg-green-100 text-green-800" },
    { id: "sharing", name: "Chia sẻ", icon: Share2, color: "bg-purple-100 text-purple-800" },
    { id: "billing", name: "Thanh toán", icon: CreditCard, color: "bg-orange-100 text-orange-800" },
    { id: "privacy", name: "Bảo mật", icon: Shield, color: "bg-red-100 text-red-800" },
    { id: "other", name: "Khác", icon: HelpCircle, color: "bg-gray-100 text-gray-800" },
  ]

  const faqData = [
    {
      category: "account",
      questions: [
        {
          q: "Làm thế nào để tạo tài khoản NotBy?",
          a: 'Bạn có thể đăng ký tài khoản miễn phí bằng email hoặc tài khoản Google/Facebook. Chỉ cần nhấp vào nút "Đăng ký" và làm theo hướng dẫn.',
        },
        {
          q: "Tôi quên mật khẩu, phải làm sao?",
          a: 'Nhấp vào "Quên mật khẩu" ở trang đăng nhập, nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.',
        },
        {
          q: "Có thể thay đổi email tài khoản không?",
          a: "Có, bạn có thể thay đổi email trong phần Cài đặt tài khoản. Bạn sẽ cần xác nhận email mới.",
        },
      ],
    },
    {
      category: "content",
      questions: [
        {
          q: "Tôi có thể tải lên bao nhiêu ảnh?",
          a: "Gói miễn phí cho phép 100 ảnh, gói Premium không giới hạn. Mỗi ảnh tối đa 10MB.",
        },
        {
          q: "Định dạng ảnh nào được hỗ trợ?",
          a: "Chúng tôi hỗ trợ JPG, PNG, HEIC và GIF. Video hỗ trợ MP4 và MOV (tối đa 100MB).",
        },
        {
          q: "Làm sao để sắp xếp ảnh theo thời gian?",
          a: "Ảnh sẽ tự động sắp xếp theo ngày chụp. Bạn cũng có thể kéo thả để sắp xếp thủ công.",
        },
      ],
    },
    {
      category: "sharing",
      questions: [
        {
          q: "Cách chia sẻ sổ tay với gia đình?",
          a: 'Vào phần "Chia sẻ", nhập email người thân và chọn quyền xem hoặc chỉnh sửa. Họ sẽ nhận email mời.',
        },
        {
          q: "Có thể tạo link chia sẻ công khai không?",
          a: "Có, bạn có thể tạo link chia sẻ với mật khẩu bảo vệ để chia sẻ với nhiều người cùng lúc.",
        },
      ],
    },
    {
      category: "billing",
      questions: [
        {
          q: "Gói Premium có những tính năng gì?",
          a: "Gói Premium bao gồm: không giới hạn ảnh/video, in sách, backup tự động, theme cao cấp và hỗ trợ ưu tiên.",
        },
        {
          q: "Có thể hủy gói Premium không?",
          a: "Có, bạn có thể hủy bất cứ lúc nào. Gói sẽ hết hạn vào cuối chu kỳ thanh toán hiện tại.",
        },
      ],
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Support ticket submitted:", formData)
    alert("Yêu cầu hỗ trợ đã được gửi! Chúng tôi sẽ phản hồi trong vòng 24 giờ.")
  }

  const filteredFAQ = selectedCategory ? faqData.filter((section) => section.category === selectedCategory) : faqData

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="shadow-lg mb-8">
          <CardHeader className="text-center bg-gradient-to-r from-pink-100 to-blue-100 rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">Hỗ Trợ Khách Hàng</CardTitle>
            <p className="text-lg text-gray-600">NotBy - Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Liên Hệ Nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Chat Trực Tuyến</p>
                    <p className="text-sm text-green-600">Phản hồi ngay lập tức</p>
                  </div>
                  <Badge className="ml-auto bg-green-100 text-green-800">Online</Badge>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Email</p>
                    <p className="text-sm text-blue-600">support@NotBy.vn</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <Phone className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-800">Hotline</p>
                    <p className="text-sm text-orange-600">0123-456-789</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-800">Giờ Hỗ Trợ</p>
                    <p className="text-sm text-gray-600">T2-T6: 9:00-18:00</p>
                    <p className="text-sm text-gray-600">T7: 9:00-12:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Categories */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Danh Mục Hỗ Trợ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {supportCategories.map((category) => {
                    const Icon = category.icon
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        className="h-auto p-3 flex flex-col items-center gap-2"
                        onClick={() => setSelectedCategory(selectedCategory === category.id ? "" : category.id)}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs">{category.name}</span>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="faq" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="faq">Câu Hỏi Thường Gặp</TabsTrigger>
                <TabsTrigger value="contact">Gửi Yêu Cầu</TabsTrigger>
              </TabsList>

              {/* FAQ Tab */}
              <TabsContent value="faq">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Câu Hỏi Thường Gặp
                    </CardTitle>
                    {selectedCategory && (
                      <Button variant="outline" size="sm" onClick={() => setSelectedCategory("")}>
                        Xem tất cả
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {filteredFAQ.map((section, sectionIndex) => (
                      <div key={section.category}>
                        {!selectedCategory && (
                          <>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                              {supportCategories.find((cat) => cat.id === section.category)?.name}
                            </h3>
                          </>
                        )}
                        <div className="space-y-4">
                          {section.questions.map((faq, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                              <h4 className="font-medium text-gray-800 mb-2 flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {faq.q}
                              </h4>
                              <p className="text-gray-600 ml-6">{faq.a}</p>
                            </div>
                          ))}
                        </div>
                        {sectionIndex < filteredFAQ.length - 1 && <Separator />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contact Form Tab */}
              <TabsContent value="contact">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      Gửi Yêu Cầu Hỗ Trợ
                    </CardTitle>
                    <p className="text-sm text-gray-600">Chúng tôi sẽ phản hồi trong vòng 24 giờ (ngày làm việc)</p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên *</label>
                          <Input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nhập họ và tên"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                          <Input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="email@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
                        <select
                          required
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="">Chọn danh mục</option>
                          {supportCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                        <Input
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="Mô tả ngắn gọn vấn đề"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết *</label>
                        <Textarea
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                        />
                      </div>

                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <p className="text-sm text-blue-700">
                          Để được hỗ trợ nhanh hơn, vui lòng cung cấp thông tin chi tiết về vấn đề
                        </p>
                      </div>

                      <Button type="submit" className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Gửi Yêu Cầu Hỗ Trợ
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Quick Help Section */}
        <Card className="shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Hướng Dẫn Nhanh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Camera className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="font-medium mb-2">Bắt Đầu Sử Dụng</h3>
                <p className="text-sm text-gray-600">Tạo tài khoản và tải ảnh đầu tiên của bé</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Share2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">Chia Sẻ Kỷ Niệm</h3>
                <p className="text-sm text-gray-600">Mời gia đình cùng xem và đóng góp kỷ niệm</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Book className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium mb-2">In Sách Kỷ Niệm</h3>
                <p className="text-sm text-gray-600">Tạo sách vật lý từ những kỷ niệm số</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
