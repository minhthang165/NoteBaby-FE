"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import ProtectedRoute from "@/components/layout/protected-route"
import { categoryAPI } from "@/lib/api/categoryAPI"
import { forumpostAPI } from "@/lib/api/forumpostAPI"
import { forumcommentAPI } from "@/lib/api/forumcommentAPI"
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
  Loader2,
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

// Define type for forum comment
interface ForumComment {
  id: string;
  content: string;
  author: string;
  authorAvatar: string;
  isExpert: boolean;
  timeAgo: string;
  likes: number;
  postId: string;
  mediaFile?: {
    fileUrl: string;
    fileName: string;
    fileType: 'image' | 'video' | 'other';
  } | null;
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
  // Track which posts have been liked by the user
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})
  // Track which comments have been liked by the user
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({})
  // State for forum post dialog
  const [selectedPost, setSelectedPost] = useState<Discussion | null>(null)
  const [postDialogOpen, setPostDialogOpen] = useState(false)
  const [postComments, setPostComments] = useState<ForumComment[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [commentFile, setCommentFile] = useState<File | null>(null)
  const [commentFilePreview, setCommentFilePreview] = useState<string | null>(null)
  const [uploadingComment, setUploadingComment] = useState(false)
  const commentFileInputRef = useRef<HTMLInputElement>(null)

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

  // Function to fetch comments for a post
  const fetchPostComments = async (postId: string) => {
    try {
      setLoadingComments(true);
      const response = await forumcommentAPI.getByPostId(postId);
      
      if (response && response.data) {
        let commentsData = [];
        
        // Check if data is nested
        if (response.data.data && Array.isArray(response.data.data)) {
          commentsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          commentsData = response.data;
        }
        
        // Map API response to our component's format
        const formattedComments = await Promise.all(commentsData.map(async (comment: any) => {
          // Calculate time ago
          const commentDate = new Date(comment.created_at);
          const now = new Date();
          const diffMinutes = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60));
          
          let timeAgo;
          if (diffMinutes < 1) {
            timeAgo = "vừa xong";
          } else if (diffMinutes < 60) {
            timeAgo = `${diffMinutes} phút trước`;
          } else if (diffMinutes < 1440) {
            timeAgo = `${Math.floor(diffMinutes / 60)} giờ trước`;
          } else {
            timeAgo = `${Math.floor(diffMinutes / 1440)} ngày trước`;
          }
          
          // Get author info - updated to match API response format
          let authorName = "Người dùng";
          let authorAvatar = "/placeholder.svg";
          let isExpert = false;
          
          // Check for different user field structures (CreatedBy or Author)
          const authorData = comment.CreatedBy || comment.Author;
          
          if (authorData) {
            authorName = `${authorData.firstName || ""} ${authorData.lastName || ""}`.trim();
            authorAvatar = authorData.photo || "/placeholder.svg";
            isExpert = authorData.role === "Admin";
          }
          
          // Check for attached file
          let mediaFile = null;
          
          if (comment.File) {
            const file = comment.File;
            mediaFile = {
              fileUrl: file.fileUrl,
              fileName: file.fileName || '',
              fileType: file.fileType || 'other'
            };
          }
          
          return {
            id: comment._id,
            content: comment.Content,
            author: authorName,
            authorAvatar: authorAvatar,
            isExpert: isExpert,
            timeAgo: timeAgo,
            likes: comment.Likes || 0,
            postId: comment.Post || comment.ForumPost, // Handle both Post and ForumPost fields
            mediaFile: mediaFile
          };
        }));
        
        setPostComments(formattedComments);
      } else {
        setPostComments([]);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setPostComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  // Handle opening the post dialog
  const handleOpenPostDialog = (post: Discussion) => {
    setSelectedPost(post);
    setPostDialogOpen(true);
    fetchPostComments(post.id);
    // Reset likedComments state when opening a different post
    setLikedComments({});
  };

  // Handle file selection for comment
  const handleCommentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setCommentFile(file);
    
    // Create preview for image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCommentFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      // For video files, we'll just show an icon or text
      setCommentFilePreview('video');
    } else {
      setCommentFilePreview('file');
    }
  };
  
  // Remove selected file
  const handleRemoveCommentFile = () => {
    setCommentFile(null);
    setCommentFilePreview(null);
    if (commentFileInputRef.current) {
      commentFileInputRef.current.value = '';
    }
  };
  
  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!selectedPost || !newComment.trim()) return;
    
    try {
      setUploadingComment(true);
      
      // Get user ID using the function from utils.ts
      let userId;
      try {
        userId = getAuthorId();
      } catch (error) {
        // Fallback to hardcoded ID if token not available
        userId = "68dc9bc344092a1355ccf5d6";
        console.warn("Using fallback user ID");
      }
      
      let fileId = null;
      
      // Handle file upload if present
      if (commentFile) {
        // 1. Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", commentFile);
        
        const cloudinaryResponse = await cloudinaryAPI.upload(formData);
        
        if (cloudinaryResponse.data.status && cloudinaryResponse.data.data) {
          const fileUrl = cloudinaryResponse.data.data;
          
          // 2. Create media file record
          const fileType = commentFile.type.startsWith('image/') 
            ? 'image' 
            : commentFile.type.startsWith('video/') 
              ? 'video' 
              : 'other';
          
          const mediaFileData = {
            fileUrl: fileUrl,
            fileName: commentFile.name.split('.')[0] || 'Comment attachment',
            fileType: fileType,
            Author: userId
          };
          
          const mediaResponse = await mediafileAPI.create(mediaFileData);
          
          if (mediaResponse.data.status && mediaResponse.data.data) {
            fileId = mediaResponse.data.data._id || mediaResponse.data.data.id;
          }
        }
      }
      
      // 3. Create the comment
      const commentData = {
        Content: newComment.trim(),
        ForumPostId: selectedPost.id, // Updated to match API field name
        File: fileId, // Include file ID if available
        CreatedBy: userId,
        Likes: 0
      };
      
      const response = await forumcommentAPI.create(commentData);
      
      if (response && response.data && response.data.status) {
        // Comment added successfully
        toast({
          title: "Bình luận thành công",
          description: "Bình luận của bạn đã được đăng",
        });
        
        // Clear comment input and file
        setNewComment("");
        handleRemoveCommentFile();
        
        // Refresh comments
        fetchPostComments(selectedPost.id);
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast({
        title: "Lỗi",
        description: "Không thể đăng bình luận. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setUploadingComment(false);
    }
  };

  // Handle liking/unliking comments
  const handleCommentLike = async (comment: ForumComment) => {
    try {
      // Toggle like status in local state
      const isCurrentlyLiked = likedComments[comment.id];
      
      // Optimistically update UI
      const updatedComments = postComments.map(c => {
        if (c.id === comment.id) {
          return {
            ...c,
            likes: isCurrentlyLiked ? c.likes - 1 : c.likes + 1
          };
        }
        return c;
      });
      
      setPostComments(updatedComments);
      
      // Update liked status in state
      setLikedComments(prev => ({
        ...prev,
        [comment.id]: !isCurrentlyLiked
      }));
      
      // Send API request
      await forumcommentAPI.update(comment.id, {
        Likes: isCurrentlyLiked ? comment.likes - 1 : comment.likes + 1
      });
      
    } catch (error) {
      console.error("Failed to update comment like:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật lượt thích. Vui lòng thử lại sau.",
        variant: "destructive"
      });
      
      // Revert changes if API call fails
      fetchPostComments(selectedPost?.id || "");
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
    <>
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
                      <Card 
                        key={discussion.id} 
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleOpenPostDialog(discussion)}
                      >
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
                                <span 
                                  className={`flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors ${likedPosts[discussion.id] ? 'text-blue-600 font-medium' : ''}`}
                                  onClick={async () => {
                                    try {
                                      // Get the current post to retrieve the latest like count
                                      const response = await forumpostAPI.getById(discussion.id);
                                      if (response && response.data && response.data.data) {
                                        const currentLikes = response.data.data.Likes || 0;
                                        
                                        // Toggle like state
                                        const isCurrentlyLiked = likedPosts[discussion.id];
                                        let newLikeCount;
                                        
                                        if (isCurrentlyLiked) {
                                          // Unlike - decrease count if previously liked
                                          newLikeCount = Math.max(0, currentLikes - 1); // Prevent negative likes
                                        } else {
                                          // Like - increase count
                                          newLikeCount = currentLikes + 1;
                                        }
                                        
                                        // Update the post
                                        const updateResponse = await forumpostAPI.update(discussion.id, {
                                          Likes: newLikeCount
                                        });
                                        
                                        // Update UI if successful
                                        if (updateResponse && updateResponse.data && updateResponse.data.status) {
                                          // Toggle liked state for this post
                                          setLikedPosts(prev => ({
                                            ...prev,
                                            [discussion.id]: !isCurrentlyLiked
                                          }));
                                          
                                          // Update the discussions state with the new like count
                                          setDiscussions(prevDiscussions => 
                                            prevDiscussions.map(post => 
                                              post.id === discussion.id 
                                                ? { ...post, likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1 } 
                                                : post
                                            )
                                          );
                                        }
                                      }
                                    } catch (error) {
                                      console.error("Failed to update likes:", error);
                                    }
                                  }}
                                >
                                  <ThumbsUp className={`h-4 w-4 ${likedPosts[discussion.id] ? 'fill-blue-600 text-blue-600' : ''}`} />
                                  {discussion.likes} thích
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className={likedPosts[discussion.id] ? 'text-blue-600' : ''}
                                  onClick={async () => {
                                    try {
                                      // Get the current post to retrieve the latest like count
                                      const response = await forumpostAPI.getById(discussion.id);
                                      if (response && response.data && response.data.data) {
                                        const currentLikes = response.data.data.Likes || 0;
                                        
                                        // Toggle like state
                                        const isCurrentlyLiked = likedPosts[discussion.id];
                                        let newLikeCount;
                                        
                                        if (isCurrentlyLiked) {
                                          // Unlike - decrease count if previously liked
                                          newLikeCount = Math.max(0, currentLikes - 1); // Prevent negative likes
                                        } else {
                                          // Like - increase count
                                          newLikeCount = currentLikes + 1;
                                        }
                                        
                                        // Update the post
                                        const updateResponse = await forumpostAPI.update(discussion.id, {
                                          Likes: newLikeCount
                                        });
                                        
                                        // Update UI if successful
                                        if (updateResponse && updateResponse.data && updateResponse.data.status) {
                                          // Toggle liked state for this post
                                          setLikedPosts(prev => ({
                                            ...prev,
                                            [discussion.id]: !isCurrentlyLiked
                                          }));
                                          
                                          // Update the discussions state with the new like count
                                          setDiscussions(prevDiscussions => 
                                            prevDiscussions.map(post => 
                                              post.id === discussion.id 
                                                ? { ...post, likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1 } 
                                                : post
                                            )
                                          );
                                        }
                                      }
                                    } catch (error) {
                                      console.error("Failed to update likes:", error);
                                    }
                                  }}
                                >
                                  <ThumbsUp className={`h-4 w-4 ${likedPosts[discussion.id] ? 'fill-blue-600 text-blue-600' : ''}`} />
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
    
    {/* Post Dialog */}
    <Dialog open={postDialogOpen} onOpenChange={setPostDialogOpen}>
      <DialogContent className="max-w-4xl w-full">
        {selectedPost && (
          <div className="max-h-[80vh] overflow-y-auto">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl">{selectedPost.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={selectedPost.authorAvatar || "/placeholder.svg"} />
                  <AvatarFallback>{selectedPost.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{selectedPost.author}</span>
                {selectedPost.isExpert && (
                  <Badge variant="secondary" className="ml-1">
                    <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
                    Chuyên gia
                  </Badge>
                )}
                <span className="text-gray-500 text-sm">{selectedPost.timeAgo}</span>
              </DialogDescription>
            </DialogHeader>
            
            <div className="mb-6">
              <p className="text-gray-700 whitespace-pre-wrap">{selectedPost.content}</p>
              
              {/* Media File Display */}
              {selectedPost.mediaFile && (
                <div className="mt-4">
                  {selectedPost.mediaFile.fileType === 'image' && (
                    <div className="rounded-lg overflow-hidden border">
                      <img 
                        src={selectedPost.mediaFile.fileUrl} 
                        alt={selectedPost.mediaFile.fileName || "Hình ảnh"}
                        className="w-full max-h-96 object-contain"
                      />
                    </div>
                  )}
                  {selectedPost.mediaFile.fileType === 'video' && (
                    <div className="rounded-lg overflow-hidden border">
                      <video 
                        src={selectedPost.mediaFile.fileUrl}
                        controls
                        className="w-full max-h-96"
                        preload="metadata"
                      >
                        Trình duyệt của bạn không hỗ trợ video.
                      </video>
                    </div>
                  )}
                  {selectedPost.mediaFile.fileType === 'other' && (
                    <div className="rounded-lg border p-4 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <Camera className="h-8 w-8 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {selectedPost.mediaFile.fileName || "Tệp đính kèm"}
                          </p>
                          <p className="text-xs text-gray-500">Tệp đính kèm</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(selectedPost.mediaFile!.fileUrl, '_blank')}
                        >
                          Xem
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedPost.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              {/* Post Stats */}
              <div className="flex items-center justify-between mt-4 pb-4 border-b">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {selectedPost.replies} trả lời
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {selectedPost.views} lượt xem
                  </span>
                  <span 
                    className={`flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors ${likedPosts[selectedPost.id] ? 'text-blue-600 font-medium' : ''}`}
                    onClick={async (e) => {
                      e.stopPropagation(); // Prevent dialog from closing
                      try {
                        // Get the current post to retrieve the latest like count
                        const response = await forumpostAPI.getById(selectedPost.id);
                        if (response && response.data && response.data.data) {
                          const currentLikes = response.data.data.Likes || 0;
                          
                          // Toggle like state
                          const isCurrentlyLiked = likedPosts[selectedPost.id];
                          let newLikeCount;
                          
                          if (isCurrentlyLiked) {
                            // Unlike - decrease count if previously liked
                            newLikeCount = Math.max(0, currentLikes - 1); // Prevent negative likes
                          } else {
                            // Like - increase count
                            newLikeCount = currentLikes + 1;
                          }
                          
                          // Update the post
                          const updateResponse = await forumpostAPI.update(selectedPost.id, {
                            Likes: newLikeCount
                          });
                          
                          // Update UI if successful
                          if (updateResponse && updateResponse.data && updateResponse.data.status) {
                            // Toggle liked state for this post
                            setLikedPosts(prev => ({
                              ...prev,
                              [selectedPost.id]: !isCurrentlyLiked
                            }));
                            
                            // Update the discussions state and selected post with the new like count
                            setDiscussions(prevDiscussions => 
                              prevDiscussions.map(post => 
                                post.id === selectedPost.id 
                                  ? { ...post, likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1 } 
                                  : post
                              )
                            );
                            setSelectedPost(prev => 
                              prev ? {
                                ...prev, 
                                likes: isCurrentlyLiked ? prev.likes - 1 : prev.likes + 1
                              } : null
                            );
                          }
                        }
                      } catch (error) {
                        console.error("Failed to update likes:", error);
                      }
                    }}
                  >
                    <ThumbsUp className={`h-4 w-4 ${likedPosts[selectedPost.id] ? 'fill-blue-600 text-blue-600' : ''}`} />
                    {selectedPost.likes} thích
                  </span>
                </div>
              </div>
            </div>
            
            {/* Comments Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Bình luận</h3>
              
              {/* New Comment Form */}
              <div className="flex gap-3 mb-6">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Viết bình luận của bạn..."
                    className="mb-2 min-h-[80px]"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  
                  {/* File Preview */}
                  {commentFilePreview && (
                    <div className="mb-3 relative rounded-md border overflow-hidden">
                      {commentFilePreview === 'video' ? (
                        <div className="flex items-center gap-2 p-2 bg-gray-50">
                          <Video className="h-5 w-5 text-blue-600" />
                          <span className="text-sm">{commentFile?.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="ml-auto rounded-full h-6 w-6 p-0"
                            onClick={handleRemoveCommentFile}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : commentFilePreview === 'file' ? (
                        <div className="flex items-center gap-2 p-2 bg-gray-50">
                          <Camera className="h-5 w-5 text-blue-600" />
                          <span className="text-sm">{commentFile?.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="ml-auto rounded-full h-6 w-6 p-0"
                            onClick={handleRemoveCommentFile}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <img 
                            src={commentFilePreview} 
                            alt="Preview" 
                            className="max-h-40 w-auto mx-auto"
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="absolute top-1 right-1 rounded-full h-6 w-6 p-0 bg-white/80"
                            onClick={handleRemoveCommentFile}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <input 
                        type="file"
                        id="commentFile"
                        ref={commentFileInputRef}
                        onChange={handleCommentFileChange}
                        className="hidden"
                        accept="image/*,video/*"
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => commentFileInputRef.current?.click()}
                        className="text-gray-600"
                      >
                        <Camera className="h-4 w-4 mr-1" />
                        Đính kèm
                      </Button>
                    </div>
                    <Button 
                      onClick={handleAddComment} 
                      disabled={!newComment.trim() || uploadingComment}
                    >
                      {uploadingComment ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang gửi...
                        </>
                      ) : 'Đăng bình luận'}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Comments List */}
              <div className="space-y-4">
                {loadingComments ? (
                  // Loading state
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                  </div>
                ) : postComments.length > 0 ? (
                  // Comments list
                  postComments.map(comment => (
                    <div key={comment.id} className="flex gap-3 pb-4 border-b border-gray-200">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.authorAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{comment.author}</span>
                            {comment.isExpert && (
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            )}
                            <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                          
                          {/* Display media if present */}
                          {comment.mediaFile && (
                            <div className="mt-2">
                              {comment.mediaFile.fileType === 'image' && (
                                <div className="rounded-lg overflow-hidden border mt-2">
                                  <img 
                                    src={comment.mediaFile.fileUrl} 
                                    alt={comment.mediaFile.fileName || "Hình ảnh"}
                                    className="max-h-60 w-auto cursor-pointer"
                                    onClick={() => window.open(comment.mediaFile?.fileUrl, '_blank')}
                                  />
                                </div>
                              )}
                              {comment.mediaFile.fileType === 'video' && (
                                <div className="rounded-lg overflow-hidden border mt-2">
                                  <video 
                                    src={comment.mediaFile.fileUrl}
                                    controls
                                    className="max-h-60 w-full"
                                    preload="metadata"
                                  >
                                    Trình duyệt của bạn không hỗ trợ video.
                                  </video>
                                </div>
                              )}
                              {comment.mediaFile.fileType === 'other' && (
                                <div className="rounded-lg border p-2 bg-gray-100 mt-2">
                                  <div className="flex items-center gap-2">
                                    <Camera className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm truncate">
                                      {comment.mediaFile.fileName || "Tệp đính kèm"}
                                    </span>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="ml-auto py-0 h-6"
                                      onClick={() => window.open(comment.mediaFile?.fileUrl, '_blank')}
                                    >
                                      Xem
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <button 
                            className={`flex items-center gap-1 hover:text-blue-600 transition-colors ${likedComments[comment.id] ? 'text-blue-600 font-medium' : ''}`}
                            onClick={() => handleCommentLike(comment)}
                          >
                            <ThumbsUp className={`h-3 w-3 ${likedComments[comment.id] ? 'fill-blue-600 text-blue-600' : ''}`} />
                            Thích
                          </button>
                          <span className={likedComments[comment.id] ? 'text-blue-600' : ''}>
                            {comment.likes > 0 ? `${comment.likes} lượt thích` : ''}
                          </span>
                          <button className="hover:text-gray-700">Trả lời</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // No comments
                  <div className="text-center py-6 text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  )
}
