"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ProtectedRoute from "@/components/layout/protected-route"
import { categoryAPI } from "@/lib/api/categoryAPI"
import { forumpostAPI } from "@/lib/api/forumpostAPI"
import { cloudinaryAPI } from "@/lib/api/cloudinaryAPI"
import { mediafileAPI } from "@/lib/api/mediafileAPI"
import { getAuthorId } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  MessageCircle,
  Users,
  Calendar,
  MapPin,
  Heart,
  Share2,
  Plus,
  Search,
  Filter,
  Star,
  Camera,
  Send,
  ThumbsUp,
  Eye,
  Award,
  Bookmark,
  Video,
  X,
} from "lucide-react"

export default function CommunityPage() {
  return (
    <ProtectedRoute>
      <CommunityPageContent />
    </ProtectedRoute>
  )
}

// Define the type for forum categories
type ForumCategory = {
  id: string;
  name: string;
  count: number;
  icon: React.ComponentType<any>;
  color: string;
}

// Define the type for discussions
interface Discussion {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  category: string;
  replies: number;
  views: number;
  likes: number;
  timeAgo: string;
  isExpert: boolean;
  tags: string[];
  isPinned?: boolean;
  hasImages?: boolean;
  mediaFile?: {
    fileUrl: string;
    fileName: string;
    fileType: 'image' | 'video' | 'other';
  };
  lastReply?: {
    author: string;
    timeAgo: string;
    isExpert: boolean;
  };
}

function CommunityPageContent() {
  const { toast } = useToast()
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [postLoading, setPostLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [discussionsLoading, setDiscussionsLoading] = useState(true)
  const [forumCategories, setForumCategories] = useState<ForumCategory[]>([])
  const [discussions, setDiscussions] = useState<Discussion[]>([])

  // File upload states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [filePreviews, setFilePreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Declare fetchForumPosts function first
  const fetchForumPosts = async () => {
    setDiscussionsLoading(true)
    try {
      const response = await forumpostAPI.getAll();
      if (response && response.data) {
        let postsData = [];
        
        // Check if data is nested (as in your example)
        if (response.data.data && Array.isArray(response.data.data)) {
          postsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          postsData = response.data;
        }
        
        // Map API response to our component's format
        const formattedDiscussions = await Promise.all(postsData.map(async (post: any) => {
          // Calculate time ago (a simple implementation)
          const postDate = new Date(post.created_at);
          const now = new Date();
          const diffMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));
          let timeAgo;
          if (diffMinutes < 60) {
            timeAgo = `${diffMinutes} phút trước`;
          } else if (diffMinutes < 24 * 60) {
            const diffHours = Math.floor(diffMinutes / 60);
            timeAgo = `${diffHours} giờ trước`;
          } else {
            const diffDays = Math.floor(diffMinutes / (24 * 60));
            timeAgo = `${diffDays} ngày trước`;
          }
          
          // Determine category (a simple implementation)
          let category = "general";
          if (post.Title?.toLowerCase().includes("sơ sinh") || post.Title?.toLowerCase().includes("newborn")) {
            category = "newborn";
          } else if (post.Title?.toLowerCase().includes("trẻ nhỏ") || post.Title?.toLowerCase().includes("infant")) {
            category = "infant";
          } else if (post.Title?.toLowerCase().includes("mới biết đi") || post.Title?.toLowerCase().includes("toddler")) {
            category = "toddler";
          } else if (post.Title?.toLowerCase().includes("sức khỏe") || post.Title?.toLowerCase().includes("health")) {
            category = "health";
          } else if (post.Title?.toLowerCase().includes("dinh dưỡng") || post.Title?.toLowerCase().includes("nutrition")) {
            category = "nutrition";
          }

          // Extract tags from title or content (a simple implementation)
          const contentText = post.Content || "";
          const potentialTags = contentText.split(/\s+/)
            .filter((word: string) => word.length > 3)
            .slice(0, 3);
            
          // Check for media file
          let mediaFile = undefined;
          let hasImages = false;
          
          // Check if post has a File property and it's not null
          if (post.File) {
            mediaFile = {
              fileUrl: post.File.fileUrl,
              fileName: post.File.fileName || "file",
              fileType: (post.File.fileType || "other") as 'image' | 'video' | 'other'
            };
            hasImages = mediaFile.fileType === 'image' || mediaFile.fileType === 'video';
          }
          
          return {
            id: post._id || post.id,
            title: post.Title || "Không có tiêu đề",
            content: post.Content || "",
            author: post.Author?.firstName ? `${post.Author.firstName} ${post.Author.lastName || ''}` : "Người dùng ẩn danh",
            authorAvatar: post.Author?.photo || "/placeholder.svg?height=40&width=40",
            category: category,
            replies: Math.floor(Math.random() * 50), // Mock data as it's not in the API
            views: post.Views || 0,
            likes: post.Likes || 0,
            timeAgo: timeAgo,
            isExpert: post.Author?.role === "Expert" || post.Author?.role === "Admin",
            tags: potentialTags,
            isPinned: false, // Mock data as it's not in the API
            hasImages: hasImages,
            mediaFile: mediaFile,
            lastReply: {
              author: "Người dùng ẩn danh",
              timeAgo: "Gần đây",
              isExpert: false
            }
          };
        }));
        
        setDiscussions(formattedDiscussions);
      }
    } catch (error) {
      console.error("Failed to fetch forum posts:", error);
      // Set default discussions on error
      setDiscussions([
        {
          id: "1",
          title: "Bé 8 tháng tuổi chưa biết bò, có bình thường không?",
          content: "Con mình đã 8 tháng rồi nhưng vẫn chưa biết bò. Bé chỉ biết lăn và ngồi thôi. Các mẹ cho hỏi có bình thường không ạ?",
          author: "Mẹ Minh An",
          authorAvatar: "/placeholder.svg?height=40&width=40",
          category: "infant",
          replies: 23,
          views: 456,
          likes: 12,
          timeAgo: "2 giờ trước",
          isExpert: false,
          tags: ["phát triển", "8 tháng", "bò"],
          hasImages: true,
          mediaFile: {
            fileUrl: "/demo-img.jpg",
            fileName: "baby-development.jpg",
            fileType: "image"
          },
          lastReply: {
            author: "BS. Nguyễn Thị Lan",
            timeAgo: "30 phút trước",
            isExpert: true,
          },
        }
      ]);
    } finally {
      setDiscussionsLoading(false);
    }
  };

  // File handling functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const newFiles = Array.from(files)
      setSelectedFiles(prev => [...prev, ...newFiles])
      
      // Create previews for the files
      newFiles.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setFilePreviews(prev => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setFilePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }

  // Determine file type based on file extension or MIME type
  const getFileType = (file: File): 'image' | 'video' | 'other' => {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type.startsWith('video/')) return 'video'
    return 'other'
  }

  // Handle forum post submission
  const handlePostSubmit = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi khi đăng bài",
        description: "Tiêu đề và nội dung không được để trống",
      });
      return;
    }

    setPostLoading(true);
    try {
      let fileId = null;

      // Handle file upload if files are selected
      if (selectedFiles.length > 0) {
        // Step 1: Upload file to Cloudinary
        const file = selectedFiles[0]; // For now, handle one file at a time
        const formData = new FormData();
        formData.append('file', file);

        const cloudinaryResponse = await cloudinaryAPI.upload(formData);
        
        if (cloudinaryResponse && cloudinaryResponse.data && cloudinaryResponse.data.data) {
          const fileUrl = cloudinaryResponse.data.data;
          
          // Step 2: Create media file record
          const mediaFileData = {
            fileUrl: fileUrl,
            fileName: file.name || "test",
            fileType: getFileType(file),
            Author: getAuthorId()
          };

          const mediaFileResponse = await mediafileAPI.create(mediaFileData);
          console.log("MediaFile response:", mediaFileResponse);
          
          if (mediaFileResponse && mediaFileResponse.data && mediaFileResponse.data.data) {
            fileId = mediaFileResponse.data.data._id || mediaFileResponse.data.data.id;
            console.log("Extracted file ID:", fileId);
          }
        }
      }

      // Step 3: Create post data object
      const postData = {
        Title: newPostTitle,
        Content: newPostContent,
        Author: getAuthorId(),
        Likes: 0,
        Views: 0,
        // Include category if selected
        ...(selectedCategory && { Category: selectedCategory }),
        // Include file ID if file was uploaded
        ...(fileId && { FileId: fileId })
      };
      console.log("Post data:", postData);

      // Step 4: Call the API to create a new post
      const response = await forumpostAPI.create(postData);
      
      if (response && response.data) {
        // Reset form fields
        setNewPostTitle("");
        setNewPostContent("");
        setSelectedCategory("");
        setSelectedFiles([]);
        setFilePreviews([]);
        
        // Refresh posts to include the new one
        fetchForumPosts();
        
        // Show success notification
        toast({
          title: "Đăng bài thành công",
          description: "Bài viết của bạn đã được đăng lên cộng đồng",
        });
      }
    } catch (error) {
      console.error("Lỗi khi đăng bài viết:", error);
      toast({
        variant: "destructive",
        title: "Lỗi khi đăng bài",
        description: "Đã xảy ra lỗi, vui lòng thử lại sau",
      });
    } finally {
      setPostLoading(false);
    }
  };

  useEffect(() => {
    // Fetch forum posts
    fetchForumPosts();

    // Fetch categories
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const response = await categoryAPI.getAll()
        if (response && response.data && Array.isArray(response.data)) {
          // Map API response to our component's format
          const categoriesWithIcons = response.data.map((category) => {
            // Determine appropriate icon and color based on category data
            let icon = MessageCircle
            let color = "bg-blue-100 text-blue-800"
            
            if (category.Title?.toLowerCase().includes("sơ sinh") || category.Title?.toLowerCase().includes("newborn")) {
              icon = Users
              color = "bg-pink-100 text-pink-800"
            } else if (category.Title?.toLowerCase().includes("trẻ nhỏ") || category.Title?.toLowerCase().includes("infant")) {
              icon = Users
              color = "bg-green-100 text-green-800"
            } else if (category.Title?.toLowerCase().includes("mới biết đi") || category.Title?.toLowerCase().includes("toddler")) {
              icon = Users
              color = "bg-purple-100 text-purple-800"
            } else if (category.Title?.toLowerCase().includes("sức khỏe") || category.Title?.toLowerCase().includes("health")) {
              icon = Heart
              color = "bg-red-100 text-red-800"
            } else if (category.Title?.toLowerCase().includes("dinh dưỡng") || category.Title?.toLowerCase().includes("nutrition")) {
              icon = Users
              color = "bg-orange-100 text-orange-800"
            }
            
            return {
              id: category._id || category.id || `category-${Math.random().toString(36).substr(2, 9)}`,
              name: category.Title || "Không có tiêu đề",
              count: category.Views || 0,
              icon: icon,
              color: color
            }
          })
          
          setForumCategories(categoriesWithIcons)
        } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
          // Handle the nested data structure you showed in your example
          const categoriesWithIcons = response.data.data.map((category: any) => {
            // Determine appropriate icon and color based on category data
            let icon = MessageCircle
            let color = "bg-blue-100 text-blue-800"
            
            if (category.Title?.toLowerCase().includes("sơ sinh") || category.Title?.toLowerCase().includes("newborn")) {
              icon = Users
              color = "bg-pink-100 text-pink-800"
            } else if (category.Title?.toLowerCase().includes("trẻ nhỏ") || category.Title?.toLowerCase().includes("infant")) {
              icon = Users
              color = "bg-green-100 text-green-800"
            } else if (category.Title?.toLowerCase().includes("mới biết đi") || category.Title?.toLowerCase().includes("toddler")) {
              icon = Users
              color = "bg-purple-100 text-purple-800"
            } else if (category.Title?.toLowerCase().includes("sức khỏe") || category.Title?.toLowerCase().includes("health")) {
              icon = Heart
              color = "bg-red-100 text-red-800"
            } else if (category.Title?.toLowerCase().includes("dinh dưỡng") || category.Title?.toLowerCase().includes("nutrition")) {
              icon = Users
              color = "bg-orange-100 text-orange-800"
            }
            
            return {
              id: category._id || category.id || `category-${Math.random().toString(36).substr(2, 9)}`,
              name: category.Title || "Không có tiêu đề",
              count: category.Views || 0,
              icon: icon,
              color: color
            }
          })
          
          setForumCategories(categoriesWithIcons)
        } else {
          // If no valid data is found, set default categories
          setForumCategories([
            { id: "general", name: "Thảo luận chung", count: 0, icon: MessageCircle, color: "bg-blue-100 text-blue-800" },
            { id: "newborn", name: "Sơ sinh (0-3 tháng)", count: 0, icon: Users, color: "bg-pink-100 text-pink-800" },
            { id: "infant", name: "Trẻ nhỏ (3-12 tháng)", count: 0, icon: Users, color: "bg-green-100 text-green-800" },
            { id: "toddler", name: "Trẻ mới biết đi (1-3 tuổi)", count: 0, icon: Users, color: "bg-purple-100 text-purple-800" },
            { id: "health", name: "Sức khỏe", count: 0, icon: Heart, color: "bg-red-100 text-red-800" },
            { id: "nutrition", name: "Dinh dưỡng", count: 0, icon: Users, color: "bg-orange-100 text-orange-800" },
          ])
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        // Set default categories on error
        setForumCategories([
          { id: "general", name: "Thảo luận chung", count: 0, icon: MessageCircle, color: "bg-blue-100 text-blue-800" },
          { id: "newborn", name: "Sơ sinh (0-3 tháng)", count: 0, icon: Users, color: "bg-pink-100 text-pink-800" },
          { id: "infant", name: "Trẻ nhỏ (3-12 tháng)", count: 0, icon: Users, color: "bg-green-100 text-green-800" },
          { id: "toddler", name: "Trẻ mới biết đi (1-3 tuổi)", count: 0, icon: Users, color: "bg-purple-100 text-purple-800" },
          { id: "health", name: "Sức khỏe", count: 0, icon: Heart, color: "bg-red-100 text-red-800" },
          { id: "nutrition", name: "Dinh dưỡng", count: 0, icon: Users, color: "bg-orange-100 text-orange-800" },
        ])
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategories()
  }, [])

  // discussions state is now declared at the top with useState

  const groups = [
    {
      id: 1,
      name: "Mẹ bỉm sữa Hà Nội",
      description: "Nhóm dành cho các mẹ ở Hà Nội chia sẻ kinh nghiệm nuôi con",
      members: 2340,
      posts: 156,
      image: "/placeholder.svg?height=100&width=100",
      isJoined: true,
      category: "Địa phương",
    },
    {
      id: 2,
      name: "Ăn dặm BLW",
      description: "Cộng đồng thực hành phương pháp ăn dặm tự chủ (Baby Led Weaning)",
      members: 1890,
      posts: 234,
      image: "/placeholder.svg?height=100&width=100",
      isJoined: false,
      category: "Dinh dưỡng",
    },
    {
      id: 3,
      name: "Bé sinh năm 2024",
      description: "Nhóm dành cho các bé sinh trong năm 2024",
      members: 3450,
      posts: 445,
      image: "/placeholder.svg?height=100&width=100",
      isJoined: true,
      category: "Theo năm sinh",
    },
  ]

  const events = [
    {
      id: 1,
      title: "Hội thảo: Dinh dưỡng cho trẻ 0-2 tuổi",
      date: "28/12/2024",
      time: "14:00 - 17:00",
      location: "Trung tâm Hội nghị Quốc gia",
      attendees: 156,
      price: "Miễn phí",
      organizer: "Bệnh viện Nhi Trung ương",
      image: "/placeholder.svg?height=150&width=250",
      isOnline: false,
    },
    {
      id: 2,
      title: "Workshop: Massage cho bé sơ sinh",
      date: "02/01/2025",
      time: "09:00 - 12:00",
      location: "Online qua Zoom",
      attendees: 89,
      price: "200.000đ",
      organizer: "Trung tâm Chăm sóc Mẹ và Bé",
      image: "/placeholder.svg?height=150&width=250",
      isOnline: true,
    },
    {
      id: 3,
      title: "Gặp mặt mẹ bỉm sữa Quận 1",
      date: "05/01/2025",
      time: "10:00 - 12:00",
      location: "Công viên Tao Đàn",
      attendees: 23,
      price: "Miễn phí",
      organizer: "Nhóm Mẹ bỉm sữa Q1",
      image: "/placeholder.svg?height=150&width=250",
      isOnline: false,
    },
  ]

  const experts = [
    {
      id: 1,
      name: "BS. Nguyễn Thị Lan",
      specialty: "Bác sĩ Nhi khoa",
      hospital: "Bệnh viện Nhi Trung ương",
      experience: "15 năm",
      rating: 4.9,
      consultations: 1250,
      avatar: "/placeholder.svg?height=60&width=60",
      isOnline: true,
      responseTime: "< 2 giờ",
    },
    {
      id: 2,
      name: "ThS. Trần Văn Nam",
      specialty: "Chuyên gia Dinh dưỡng",
      hospital: "Viện Dinh dưỡng Quốc gia",
      experience: "12 năm",
      rating: 4.8,
      consultations: 890,
      avatar: "/placeholder.svg?height=60&width=60",
      isOnline: false,
      responseTime: "< 4 giờ",
    },
    {
      id: 3,
      name: "BS. Lê Thị Hoa",
      specialty: "Bác sĩ Tâm lý trẻ em",
      hospital: "Bệnh viện Nhi Đồng 1",
      experience: "10 năm",
      rating: 4.9,
      consultations: 670,
      avatar: "/placeholder.svg?height=60&width=60",
      isOnline: true,
      responseTime: "< 1 giờ",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cộng đồng NoteBaby</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kết nối với hàng nghìn bậc phụ huynh, chia sẻ kinh nghiệm và nhận tư vấn từ chuyên gia
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{loading ? "..." : "12,450"}</p>
              <p className="text-sm text-gray-600">Thành viên</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">{discussionsLoading ? "..." : discussions.length.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Thảo luận</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold">{discussionsLoading ? "..." : discussions.filter(d => d.isExpert).length}</p>
              <p className="text-sm text-gray-600">Chuyên gia</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold">{loading ? "..." : events.length}</p>
              <p className="text-sm text-gray-600">Sự kiện</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="discussions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="discussions">Thảo luận</TabsTrigger>
            <TabsTrigger value="groups">Nhóm</TabsTrigger>
            <TabsTrigger value="events">Sự kiện</TabsTrigger>
            <TabsTrigger value="experts">Chuyên gia</TabsTrigger>
            <TabsTrigger value="qa">Hỏi đáp</TabsTrigger>
          </TabsList>

          <TabsContent value="discussions" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                {/* Create Post */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Tạo bài viết mới
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input 
                      placeholder="Nhập tiêu đề bài viết..."
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      className="mb-2"
                    />
                    <Textarea
                      placeholder="Bạn muốn chia sẻ điều gì với cộng đồng?"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      rows={3}
                    />
                    
                    {/* File Preview Section */}
                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Tệp đã chọn:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="border rounded-lg p-2 bg-gray-50">
                                {getFileType(file) === 'image' && filePreviews[index] && (
                                  <img 
                                    src={filePreviews[index]} 
                                    alt={file.name}
                                    className="w-full h-20 object-cover rounded"
                                  />
                                )}
                                {getFileType(file) === 'video' && (
                                  <div className="w-full h-20 bg-gray-200 rounded flex items-center justify-center">
                                    <Video className="h-8 w-8 text-gray-500" />
                                  </div>
                                )}
                                {getFileType(file) === 'other' && (
                                  <div className="w-full h-20 bg-gray-200 rounded flex items-center justify-center">
                                    <Camera className="h-8 w-8 text-gray-500" />
                                  </div>
                                )}
                                <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                              </div>
                              <button
                                onClick={() => removeFile(index)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCameraClick}>
                          <Camera className="h-4 w-4 mr-2" />
                          Ảnh
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <select 
                          className="px-3 py-1 border rounded-md text-sm"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                          <option value="">Chọn danh mục</option>
                          {forumCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Button 
                        onClick={handlePostSubmit} 
                        disabled={postLoading || !newPostTitle.trim() || !newPostContent.trim()}
                      >
                        {postLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Đang đăng...</span>
                          </div>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Đăng bài
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Search and Filter */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input placeholder="Tìm kiếm thảo luận..." className="pl-10" />
                      </div>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Bộ lọc
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Discussions List */}
                <div className="space-y-4">
                  {discussionsLoading ? (
                    // Show loading state for discussions
                    Array(3).fill(0).map((_, index) => (
                      <Card key={`loading-${index}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="flex-1 space-y-3">
                              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                              <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
                              <div className="flex gap-2">
                                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex gap-3">
                                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                </div>
                                <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : discussions.length > 0 ? (
                    // Show discussions if available
                    discussions.map((discussion) => (
                      <Card key={discussion.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={discussion.authorAvatar || "/placeholder.svg"} />
                              <AvatarFallback>{discussion.author.charAt(0)}</AvatarFallback>
                            </Avatar>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  {discussion.isPinned && <Badge className="bg-yellow-100 text-yellow-800">Ghim</Badge>}
                                  <h3 className="font-bold text-lg">{discussion.title}</h3>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <span className="font-medium">{discussion.author}</span>
                                    {discussion.isExpert && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                                  </span>
                                  <span>{discussion.timeAgo}</span>
                                  <Badge variant="outline">
                                    {forumCategories.find((c) => c.id === discussion.category)?.name}
                                  </Badge>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Bookmark className="h-4 w-4" />
                              </Button>
                            </div>

                            <p className="text-gray-700 mb-4 line-clamp-2">{discussion.content}</p>

                            {/* Media File Display */}
                            {discussion.mediaFile && (
                              <div className="mb-4">
                                {discussion.mediaFile.fileType === 'image' && (
                                  <div className="rounded-lg overflow-hidden border">
                                    <img 
                                      src={discussion.mediaFile.fileUrl} 
                                      alt={discussion.mediaFile.fileName || "Hình ảnh"}
                                      className="w-full max-h-64 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                      onClick={() => window.open(discussion.mediaFile!.fileUrl, '_blank')}
                                    />
                                  </div>
                                )}
                                {discussion.mediaFile.fileType === 'video' && (
                                  <div className="rounded-lg overflow-hidden border">
                                    <video 
                                      src={discussion.mediaFile.fileUrl}
                                      controls
                                      className="w-full max-h-64 object-cover"
                                      preload="metadata"
                                    >
                                      Trình duyệt của bạn không hỗ trợ video.
                                    </video>
                                  </div>
                                )}
                                {discussion.mediaFile.fileType === 'other' && (
                                  <div className="rounded-lg border p-4 bg-gray-50">
                                    <div className="flex items-center gap-3">
                                      <div className="flex-shrink-0">
                                        <Camera className="h-8 w-8 text-gray-500" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                          {discussion.mediaFile.fileName || "Tệp đính kèm"}
                                        </p>
                                        <p className="text-xs text-gray-500">Tệp đính kèm</p>
                                      </div>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => window.open(discussion.mediaFile!.fileUrl, '_blank')}
                                      >
                                        Xem
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="flex flex-wrap gap-1 mb-4">
                              {discussion.tags.map((tag: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="h-4 w-4" />
                                  {discussion.replies} trả lời
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  {discussion.views} lượt xem
                                </span>
                                <span className="flex items-center gap-1">
                                  <ThumbsUp className="h-4 w-4" />
                                  {discussion.likes} thích
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <ThumbsUp className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  Trả lời
                                </Button>
                              </div>
                            </div>

                            {discussion.lastReply && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-xs text-gray-500">
                                  Trả lời cuối bởi <span className="font-medium">{discussion.lastReply.author}</span>
                                  {discussion.lastReply.isExpert && (
                                    <Star className="inline h-3 w-3 text-yellow-500 fill-current ml-1" />
                                  )}{" "}
                                  - {discussion.lastReply.timeAgo}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                  ) : (
                    // Show message if no discussions
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-gray-500">Không có bài thảo luận nào</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Danh mục thảo luận</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {loading ? (
                      // Show loading skeletons
                      Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <div key={index} className="flex items-center justify-between p-2">
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="h-5 w-10 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        ))
                    ) : forumCategories.length > 0 ? (
                      // Show categories if available
                      forumCategories.map((category) => {
                        const Icon = category.icon
                        return (
                          <div
                            key={category.id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-gray-600" />
                              <span className="text-sm font-medium">{category.name}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {category.count}
                            </Badge>
                          </div>
                        )
                      })
                    ) : (
                      // Show message if no categories
                      <div className="text-center py-4 text-gray-500">
                        Không tìm thấy danh mục nào
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Online Experts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Chuyên gia trực tuyến</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {experts
                      .filter((expert) => expert.isOnline)
                      .map((expert) => (
                        <div key={expert.id} className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={expert.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{expert.name}</p>
                            <p className="text-xs text-gray-600">{expert.specialty}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Hỏi
                          </Button>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Nhóm cộng đồng</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tạo nhóm mới
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={group.image || "/placeholder.svg"}
                        alt={group.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{group.name}</h3>
                        <Badge variant="outline" className="text-xs mb-2">
                          {group.category}
                        </Badge>
                        <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span>{group.members.toLocaleString()} thành viên</span>
                      <span>{group.posts} bài viết</span>
                    </div>

                    <Button className="w-full" variant={group.isJoined ? "outline" : "default"}>
                      {group.isJoined ? "Đã tham gia" : "Tham gia"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Sự kiện sắp tới</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tạo sự kiện
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-40 object-cover" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={event.isOnline ? "secondary" : "default"}>
                        {event.isOnline ? "Online" : "Offline"}
                      </Badge>
                      <Badge variant="outline">{event.price}</Badge>
                    </div>

                    <h3 className="font-bold mb-2 line-clamp-2">{event.title}</h3>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {event.date} • {event.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{event.attendees} người tham gia</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-4">Tổ chức bởi {event.organizer}</p>

                    <Button className="w-full">Đăng ký tham gia</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experts" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6">Đội ngũ chuyên gia</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experts.map((expert) => (
                  <Card key={expert.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={expert.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {expert.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold mb-1">{expert.name}</h3>
                          <p className="text-blue-600 font-medium text-sm mb-1">{expert.specialty}</p>
                          <p className="text-gray-600 text-xs mb-2">{expert.hospital}</p>
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{expert.rating}</span>
                            <span className="text-xs text-gray-500">({expert.consultations} tư vấn)</span>
                          </div>
                          <p className="text-xs text-gray-500">{expert.experience} kinh nghiệm</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                        <span>Phản hồi: {expert.responseTime}</span>
                        <Badge variant={expert.isOnline ? "default" : "secondary"}>
                          {expert.isOnline ? "Trực tuyến" : "Offline"}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1">Tư vấn</Button>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qa" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Đặt câu hỏi cho chuyên gia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Tiêu đề câu hỏi..." />
                <Textarea placeholder="Mô tả chi tiết câu hỏi của bạn..." rows={4} />
                <div className="flex gap-4">
                  <select className="px-3 py-2 border rounded-md">
                    <option value="">Chọn chuyên khoa</option>
                    {forumCategories
                      .filter(category => 
                        category.name.includes('Sức khỏe') || 
                        category.name.includes('Dinh dưỡng') ||
                        category.name.includes('Nhi khoa') ||
                        category.name.includes('Tâm lý')
                      )
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    {forumCategories.length === 0 && (
                      <>
                        <option>Nhi khoa</option>
                        <option>Dinh dưỡng</option>
                        <option>Tâm lý</option>
                      </>
                    )}
                  </select>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Gửi câu hỏi
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="text-center py-8">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Chưa có câu hỏi nào</h3>
              <p className="text-gray-600">Hãy là người đầu tiên đặt câu hỏi cho chuyên gia!</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
