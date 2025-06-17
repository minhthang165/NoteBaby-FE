"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  BookOpen,
  Play,
  Download,
  Heart,
  Star,
  Clock,
  Baby,
  Utensils,
  Moon,
  Stethoscope,
  Gamepad2,
  GraduationCap,
  Filter,
  Bookmark,
  Share2,
  Eye,
} from "lucide-react"

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "Tất cả", icon: BookOpen, count: 156 },
    { id: "feeding", name: "Dinh dưỡng", icon: Utensils, count: 32 },
    { id: "sleep", name: "Giấc ngủ", icon: Moon, count: 24 },
    { id: "health", name: "Sức khỏe", icon: Stethoscope, count: 28 },
    { id: "development", name: "Phát triển", icon: Baby, count: 35 },
    { id: "play", name: "Vui chơi", icon: Gamepad2, count: 21 },
    { id: "education", name: "Giáo dục", icon: GraduationCap, count: 16 },
  ]

  const featuredArticles = [
    {
      id: 1,
      title: "Hướng dẫn ăn dặm cho bé 6 tháng tuổi",
      description: "Cách bắt đầu ăn dặm an toàn và đúng cách cho bé từ 6 tháng",
      category: "feeding",
      author: "BS. Nguyễn Thị Lan",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      readTime: "8 phút",
      views: 2340,
      likes: 156,
      image: "/placeholder.svg?height=200&width=300",
      tags: ["ăn dặm", "6 tháng", "dinh dưỡng"],
      featured: true,
    },
    {
      id: 2,
      title: "Cách giúp bé ngủ ngon suốt đêm",
      description: "Những phương pháp hiệu quả để thiết lập thói quen ngủ tốt cho trẻ",
      category: "sleep",
      author: "ThS. Trần Văn Nam",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      readTime: "12 phút",
      views: 1890,
      likes: 203,
      image: "/placeholder.svg?height=200&width=300",
      tags: ["giấc ngủ", "thói quen", "đêm"],
      featured: true,
    },
    {
      id: 3,
      title: "Dấu hiệu phát triển bình thường ở trẻ 0-12 tháng",
      description: "Những cột mốc phát triển quan trọng mà cha mẹ cần biết",
      category: "development",
      author: "BS. Lê Thị Hoa",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      readTime: "15 phút",
      views: 3120,
      likes: 287,
      image: "/placeholder.svg?height=200&width=300",
      tags: ["phát triển", "cột mốc", "0-12 tháng"],
      featured: true,
    },
  ]

  const articles = [
    {
      id: 4,
      title: "Cách xử lý khi bé bị sốt",
      description: "Hướng dẫn chi tiết cách chăm sóc bé khi bị sốt tại nhà",
      category: "health",
      author: "BS. Phạm Minh Đức",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      readTime: "6 phút",
      views: 1560,
      likes: 89,
      image: "/placeholder.svg?height=150&width=200",
      tags: ["sốt", "chăm sóc", "sức khỏe"],
      featured: false,
    },
    {
      id: 5,
      title: "Trò chơi phát triển trí tuệ cho bé 6-12 tháng",
      description: "Những hoạt động vui chơi giúp kích thích phát triển não bộ",
      category: "play",
      author: "Cô Nguyễn Thảo",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      readTime: "10 phút",
      views: 980,
      likes: 67,
      image: "/placeholder.svg?height=150&width=200",
      tags: ["trò chơi", "trí tuệ", "6-12 tháng"],
      featured: false,
    },
    {
      id: 6,
      title: "Massage cho bé sơ sinh",
      description: "Kỹ thuật massage giúp bé thư giãn và phát triển tốt hơn",
      category: "health",
      author: "ThS. Võ Thị Mai",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      readTime: "7 phút",
      views: 1234,
      likes: 98,
      image: "/placeholder.svg?height=150&width=200",
      tags: ["massage", "sơ sinh", "thư giãn"],
      featured: false,
    },
  ]

  const videos = [
    {
      id: 1,
      title: "Cách tắm cho bé sơ sinh an toàn",
      duration: "8:32",
      views: 45600,
      author: "BS. Nguyễn Thị Lan",
      thumbnail: "/placeholder.svg?height=180&width=320",
      category: "health",
    },
    {
      id: 2,
      title: "Hướng dẫn cho bé bú đúng cách",
      duration: "12:15",
      views: 32100,
      author: "Cô Trần Thảo",
      thumbnail: "/placeholder.svg?height=180&width=320",
      category: "feeding",
    },
    {
      id: 3,
      title: "Bài tập vận động cho bé 3-6 tháng",
      duration: "15:20",
      views: 28900,
      author: "ThS. Lê Văn Minh",
      thumbnail: "/placeholder.svg?height=180&width=320",
      category: "development",
    },
  ]

  const experts = [
    {
      id: 1,
      name: "BS. Nguyễn Thị Lan",
      specialty: "Bác sĩ Nhi khoa",
      experience: "15 năm kinh nghiệm",
      articles: 28,
      avatar: "/placeholder.svg?height=60&width=60",
      verified: true,
    },
    {
      id: 2,
      name: "ThS. Trần Văn Nam",
      specialty: "Chuyên gia Dinh dưỡng",
      experience: "12 năm kinh nghiệm",
      articles: 22,
      avatar: "/placeholder.svg?height=60&width=60",
      verified: true,
    },
    {
      id: 3,
      name: "Cô Nguyễn Thảo",
      specialty: "Giáo viên Mầm non",
      experience: "10 năm kinh nghiệm",
      articles: 18,
      avatar: "/placeholder.svg?height=60&width=60",
      verified: true,
    },
  ]

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Thư viện hướng dẫn chăm sóc trẻ em</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kho tàng kiến thức từ các chuyên gia hàng đầu về chăm sóc và nuôi dưỡng trẻ em
          </p>
        </div>

       {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm bài viết, video hướng dẫn..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Bộ lọc
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Danh mục</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedCategory === category.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-medium text-sm">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.count} bài</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="articles">Bài viết</TabsTrigger>
            <TabsTrigger value="videos">Video</TabsTrigger>
            <TabsTrigger value="experts">Chuyên gia</TabsTrigger>
            <TabsTrigger value="downloads">Tài liệu</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-8">
            {/* Featured Articles */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết nổi bật</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredArticles.map((article) => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-3 left-3 bg-yellow-500">Nổi bật</Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">{categories.find((c) => c.id === article.category)?.name}</Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={article.authorAvatar || "/placeholder.svg"} />
                            <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{article.author}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {article.likes}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {article.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1">Đọc bài</Button>
                        <Button variant="outline" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Regular Articles */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tất cả bài viết</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-40 object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {categories.find((c) => c.id === article.category)?.name}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </div>
                      </div>
                      <h3 className="font-bold mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.description}</p>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={article.authorAvatar || "/placeholder.svg"} />
                            <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {article.likes}
                          </span>
                        </div>
                      </div>

                      <Button className="w-full" size="sm">
                        Đọc bài
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Video hướng dẫn</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <Button size="lg" className="rounded-full w-16 h-16">
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                      <Badge className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white">
                        {video.duration}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold mb-2 line-clamp-2">{video.title}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{video.author}</span>
                        <span>{video.views.toLocaleString()} lượt xem</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="experts" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Đội ngũ chuyên gia</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experts.map((expert) => (
                  <Card key={expert.id} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="relative inline-block mb-4">
                        <Avatar className="h-20 w-20 mx-auto">
                          <AvatarImage src={expert.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {expert.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                            <Star className="h-3 w-3 text-white fill-current" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-1">{expert.name}</h3>
                      <p className="text-blue-600 font-medium mb-1">{expert.specialty}</p>
                      <p className="text-gray-600 text-sm mb-3">{expert.experience}</p>
                      <div className="flex justify-center gap-4 text-sm text-gray-600 mb-4">
                        <span>{expert.articles} bài viết</span>
                      </div>
                      <Button className="w-full">Xem hồ sơ</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="downloads" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tài liệu tải về</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Bảng theo dõi phát triển 0-12 tháng",
                    description: "Bảng kiểm tra các cột mốc phát triển quan trọng",
                    type: "PDF",
                    size: "2.3 MB",
                    downloads: 1250,
                  },
                  {
                    title: "Thực đơn ăn dặm theo tuổi",
                    description: "Hướng dẫn chi tiết thực đơn ăn dặm từ 6-24 tháng",
                    type: "PDF",
                    size: "1.8 MB",
                    downloads: 980,
                  },
                  {
                    title: "Lịch tiêm chủng đầy đủ",
                    description: "Lịch tiêm vaccine theo khuyến cáo của Bộ Y tế",
                    type: "PDF",
                    size: "1.2 MB",
                    downloads: 2100,
                  },
                ].map((doc, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-red-100 p-3 rounded-lg">
                          <Download className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold mb-2">{doc.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{doc.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <span>{doc.type}</span>
                            <span>{doc.size}</span>
                            <span>{doc.downloads} lượt tải</span>
                          </div>
                          <Button className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Tải về
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
