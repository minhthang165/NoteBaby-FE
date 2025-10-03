"use client"

import { useState, useEffect, useRef, FormEvent } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { CreateArticleModal } from "@/components/create-article-modal"
import { Label } from "@/components/ui/label"
import { Toast } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
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
  Loader2,
  Upload,
  Video,
  X
} from "lucide-react"
import { categoryAPI } from "@/lib/api/categoryAPI"
import { articlesAPI } from "@/lib/api/articleAPI"
import { mediafileAPI } from "@/lib/api/mediafileAPI"
import { cloudinaryAPI } from "@/lib/api/cloudinaryAPI"
import { userApi } from "@/lib/api/userAPI"

// Define type for category from API
interface ApiCategory {
  _id: string;
  Title: string;
  created_at: string;
  updated_at: string;
  __v: number;
  id: string;
}

// Define type for article from API
interface ApiArticle {
  _id: string;
  Category: {
    _id: string;
    Title: string;
    created_at: string;
    updated_at: string;
    __v: number;
    id: string;
  };
  Title: string;
  Content: string;
  File: {
    _id: string;
    fileUrl: string;
    created_at: string;
    updated_at: string;
    __v: number;
    id: string;
  };
  Author: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    photo: string;
    role: string;
    id: string;
  };
  Likes: number;
  Views: number;
  Tags: string[];
  ReadTime: number;
  Description: string;
  created_at: string;
  updated_at: string;
  __v: number;
  id: string;
}

// Define type for our component's article
interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  authorAvatar: string;
  readTime: string;
  views: number;
  likes: number;
  image: string;
  tags: string[];
  featured: boolean;
}

// Define type for our component's category
interface CategoryWithIcon {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  count: number;
  apiId?: string;
}

// Define type for API video data
interface ApiVideo {
  _id: string;
  fileName: string;
  fileType: string;
  Author: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    photo: string;
    role: string;
  };
  fileUrl: string;
  created_at: string;
  updated_at: string;
  __v: number;
  id: string;
}

// Define type for our component's video
interface Video {
  id: string;
  title: string;
  duration: string;
  views: number;
  author: string;
  authorPhoto?: string | null;
  thumbnail: string;
  category: string;
  fileUrl: string;
}

// Define type for API download data
interface ApiDownload {
  _id: string;
  fileName: string;
  fileType: string;
  Author: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    photo: string;
    role: string;
    id: string;
  };
  fileUrl: string;
  created_at: string;
  updated_at: string;
  __v: number;
  id: string;
}

// Define type for our component's download
interface Download {
  id: string;
  title: string;
  description: string;
  type: string;
  size: string;
  downloads: number;
  fileUrl: string;
  author: string;
  authorPhoto?: string | null;
}

// Define type for API user data
interface ApiUser {
  _id: string;
  isActive: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
  createdBy: string | null;
  updateBy: string | null;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  email: string;
  gender: string;
  googleId: string;
  photo: string;
  role: string;
  created_at: string;
  updated_at: string;
  __v: number;
  id: string;
}

// Define type for our component's expert
interface Expert {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  articles: number;
  avatar: string;
  verified: boolean;
}

// Map of category titles to their icons and IDs
const categoryIconMap: Record<string, { icon: React.ComponentType<any>; id: string }> = {
  "Dinh dưỡng": { icon: Utensils, id: "feeding" },
  "Giấc ngủ": { icon: Moon, id: "sleep" },
  "Sức khỏe": { icon: Stethoscope, id: "health" },
  "Phát triển": { icon: Baby, id: "development" },
  "Vui chơi": { icon: Gamepad2, id: "play" },
  "Giáo dục": { icon: GraduationCap, id: "education" },
}

// Helper function to determine the correct file extension
const getFileExtension = (fileUrl: string, fileType: string): string => {
  // Try to extract extension from URL
  const urlExtension = fileUrl.split('.').pop();
  
  // Common file types and their extensions
  const extensionMap: Record<string, string> = {
    'pdf': '.pdf',
    'doc': '.doc',
    'docx': '.docx',
    'xls': '.xls',
    'xlsx': '.xlsx',
    'ppt': '.ppt',
    'pptx': '.pptx',
    'txt': '.txt',
    'csv': '.csv',
    'zip': '.zip',
    'rar': '.rar',
    'image': '.png', // Default for images
    'video': '.mp4', // Default for videos
    'other': '.pdf'  // Default for other types
  };
  
  // If URL ends with a recognized extension that is 2-5 characters long, use it
  if (urlExtension && /^[a-zA-Z0-9]{2,5}$/.test(urlExtension)) {
    return `.${urlExtension.toLowerCase()}`;
  }
  
  // If URL contains file type hints
  if (fileUrl.includes('/pdf/')) return '.pdf';
  if (fileUrl.includes('/doc/')) return '.docx';
  if (fileUrl.includes('/excel/')) return '.xlsx';
  
  // Check if fileType is a key in our map or has any common extensions in it
  for (const [key, extension] of Object.entries(extensionMap)) {
    if (fileType.toLowerCase().includes(key)) {
      return extension;
    }
  }
  
  // Default to PDF for Cloudinary document files if we can't determine type
  return '.pdf';
}

// VideoUploadModal Component
function VideoUploadModal({ open, onOpenChange, onUploadSuccess }: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: () => void;
}) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Use the file name as default but allow user to change it
      setFileName(file.name.split('.')[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedFile || !fileName.trim()) {
      toast({
        title: "Error",
        description: "Please select a file and provide a name",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      // Upload file to Cloudinary
      const uploadResponse = await cloudinaryAPI.upload(formData);
      
      if (uploadResponse.data.status && uploadResponse.data.data) {
        const fileUrl = uploadResponse.data.data;
        
        // Get user ID from JWT token
        const jwtToken = localStorage.getItem('jwtToken');
        let userId = ""; 
        
        // Normally you'd decode the JWT to get the user ID, but for now we'll use the one provided
        userId = "68dc9bc344092a1355ccf5d6"; // From user request
        
        // Create media file record
        const mediaFileData = {
          fileUrl: fileUrl,
          fileName: fileName,
          fileType: "video",
          Author: userId
        };
        
        const mediaResponse = await mediafileAPI.create(mediaFileData);
        
        if (mediaResponse.data.status) {
          toast({
            title: "Success",
            description: "Video uploaded successfully",
          });
          onUploadSuccess();
          onOpenChange(false);
        } else {
          throw new Error("Failed to create media record");
        }
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setFileName("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
          <DialogDescription>
            Upload a new video to the library. The video will be processed and added to your collection.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fileName">Video Title</Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter video title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="video">Video File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors" 
                 onClick={() => fileInputRef.current?.click()}>
              <input
                ref={fileInputRef}
                id="video"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                required
              />
              
              {selectedFile ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Video className="h-6 w-6 text-blue-500 mr-2" />
                    <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetForm();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Click to upload or drag and drop</span>
                  <span className="text-xs text-gray-400 mt-1">MP4, WebM, or other video formats</span>
                </div>
              )}
            </div>
          </div>
          
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading || !selectedFile}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : "Upload Video"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// FileUploadModal Component
function FileUploadModal({ open, onOpenChange, onUploadSuccess }: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: () => void;
}) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [fileDescription, setFileDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Use the file name as default but allow user to change it
      setFileName(file.name.split('.')[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedFile || !fileName.trim()) {
      toast({
        title: "Error",
        description: "Please select a file and provide a name",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      // Upload file to Cloudinary
      const uploadResponse = await cloudinaryAPI.upload(formData);
      
      if (uploadResponse.data.status && uploadResponse.data.data) {
        const fileUrl = uploadResponse.data.data;
        
        // Get user ID from JWT token
        const jwtToken = localStorage.getItem('jwtToken');
        let userId = ""; 
        
        // Normally you'd decode the JWT to get the user ID, but for now we'll use the one provided
        userId = "68dc9bc344092a1355ccf5d6"; // From user request
        
        // Create media file record
        const mediaFileData = {
          fileUrl: fileUrl,
          fileName: fileName,
          fileType: "other",
          Author: userId,
          description: fileDescription || "" // Optional description
        };
        
        const mediaResponse = await mediafileAPI.create(mediaFileData);
        
        if (mediaResponse.data.status) {
          toast({
            title: "Success",
            description: "File uploaded successfully",
          });
          onUploadSuccess();
          onOpenChange(false);
        } else {
          throw new Error("Failed to create media record");
        }
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setFileName("");
    setFileDescription("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tải lên tài liệu</DialogTitle>
          <DialogDescription>
            Tải lên tài liệu mới vào thư viện. Tài liệu sẽ được xử lý và thêm vào bộ sưu tập của bạn.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fileName">Tên tài liệu</Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Nhập tên tài liệu"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fileDescription">Mô tả (tùy chọn)</Label>
            <Input
              id="fileDescription"
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
              placeholder="Nhập mô tả ngắn về tài liệu"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">Chọn file</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors" 
                 onClick={() => fileInputRef.current?.click()}>
              <input
                ref={fileInputRef}
                id="file"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                required
              />
              
              {selectedFile ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Download className="h-6 w-6 text-blue-500 mr-2" />
                    <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetForm();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Nhấn để tải lên hoặc kéo thả file vào đây</span>
                  <span className="text-xs text-gray-400 mt-1">PDF, DOCX, XLSX, hoặc các định dạng file khác</span>
                </div>
              )}
            </div>
          </div>
          
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
              Hủy bỏ
            </Button>
            <Button type="submit" disabled={isUploading || !selectedFile}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tải lên...
                </>
              ) : "Tải lên"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function LibraryPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState<CategoryWithIcon[]>([
    { id: "all", name: "Tất cả", icon: BookOpen, count: 0 },
  ])
  const [articles, setArticles] = useState<Article[]>([])
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingArticles, setLoadingArticles] = useState(true)
  const [errorArticles, setErrorArticles] = useState<string | null>(null)
  const [loadingVideos, setLoadingVideos] = useState(true)
  const [errorVideos, setErrorVideos] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [videoUploadModalOpen, setVideoUploadModalOpen] = useState(false)
  const [fileUploadModalOpen, setFileUploadModalOpen] = useState(false)
  const [downloads, setDownloads] = useState<Download[]>([])
  const [loadingDownloads, setLoadingDownloads] = useState(true)
  const [errorDownloads, setErrorDownloads] = useState<string | null>(null)
  const [experts, setExperts] = useState<Expert[]>([])
  const [loadingExperts, setLoadingExperts] = useState(true)
  const [errorExperts, setErrorExperts] = useState<string | null>(null)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll()
        
        if (response.data.status === true && response.data.data) {
          // Transform API data to match our component structure
          const apiCategories: CategoryWithIcon[] = response.data.data.map((category: ApiCategory) => {
            const titleKey = category.Title as string;
            const iconMapping = categoryIconMap[titleKey] || { icon: BookOpen, id: category._id };
            
            return {
              id: iconMapping.id || category._id,
              name: category.Title,
              icon: iconMapping.icon,
              count: Math.floor(Math.random() * 40) + 10, // Just for demo purposes
              apiId: category._id // Keep the original API ID
            };
          });
          
          // Add the "All" category at the beginning
          const allCategoriesCount = apiCategories.reduce((acc: number, cat: CategoryWithIcon) => acc + cat.count, 0);
          const allCategories = [
            { id: "all", name: "Tất cả", icon: BookOpen, count: allCategoriesCount },
            ...apiCategories
          ];
          
          setCategories(allCategories);
        } else {
          setError("Failed to load categories");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Error loading categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  
  // Fetch experts
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoadingExperts(true);
        const response = await userApi.getByRole("Admin");
        
        if (response.data.status === true && response.data.data) {
          const apiUsers: ApiUser[] = response.data.data;
          
          // Transform API data to match our component structure
          const transformedExperts: Expert[] = apiUsers.map((user: ApiUser) => {
            // Generate a random specialty based on the user's name
            let specialty = "Chuyên gia";
            const specialties = [
              "Bác sĩ Nhi khoa", 
              "Chuyên gia Dinh dưỡng", 
              "Giáo viên Mầm non", 
              "Chuyên gia Tâm lý trẻ em",
              "Chuyên gia Phát triển"
            ];
            
            // Get a deterministic but random-looking specialty based on user ID
            const specialtyIndex = user._id.charCodeAt(0) % specialties.length;
            specialty = specialties[specialtyIndex];
            
            // Generate experience (random but based on user ID for consistency)
            const yearsExp = (user._id.charCodeAt(1) % 10) + 5;
            const experience = `${yearsExp} năm kinh nghiệm`;
            
            // Generate random number of articles
            const articles = (user._id.charCodeAt(2) % 30) + 10;
            
            return {
              id: user._id,
              name: `${user.firstName} ${user.lastName}`.trim(),
              specialty: specialty,
              experience: experience,
              articles: articles,
              avatar: user.photo || "/placeholder.svg?height=60&width=60",
              verified: true
            };
          });
          
          setExperts(transformedExperts);
        } else {
          setErrorExperts("Failed to load experts");
        }
      } catch (err) {
        console.error("Error fetching experts:", err);
        setErrorExperts("Error loading experts. Please try again later.");
      } finally {
        setLoadingExperts(false);
      }
    };
    
    fetchExperts();
  }, []);

  // Fetch downloads
  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        setLoadingDownloads(true);
        const response = await mediafileAPI.getByFileType("other");
        
        if (response.data.status === true && response.data.data) {
          const apiDownloads: ApiDownload[] = response.data.data;
          
          // Transform API data to match our component structure
          const transformedDownloads: Download[] = apiDownloads.map((download: ApiDownload) => {
            // Get author name from the populated Author object
            const authorName = download.Author ? 
              `${download.Author.firstName || ""} ${download.Author.lastName || ""}`.trim() : 
              "Chuyên gia NoteBaby";
            
            // Get author photo if available
            const authorPhoto = download.Author?.photo || null;
            
            // Calculate file size (will be random for demo)
            const fileSizeMB = (Math.random() * 3 + 0.5).toFixed(1);
            
            // Extract file type from URL or use a default
            let fileType = "PDF";
            if (download.fileUrl.toLowerCase().includes(".doc")) fileType = "DOC";
            else if (download.fileUrl.toLowerCase().includes(".xls")) fileType = "XLS";
            else if (download.fileUrl.toLowerCase().includes(".ppt")) fileType = "PPT";
            
            return {
              id: download._id,
              title: download.fileName,
              description: `Tài liệu hướng dẫn về ${download.fileName.toLowerCase()}`,
              type: fileType,
              size: `${fileSizeMB} MB`,
              downloads: Math.floor(Math.random() * 2000) + 500, // Random download count for demo
              fileUrl: download.fileUrl,
              author: authorName,
              authorPhoto: authorPhoto
            };
          });
          
          setDownloads(transformedDownloads);
        } else {
          setErrorDownloads("Failed to load downloads");
        }
      } catch (err) {
        console.error("Error fetching downloads:", err);
        setErrorDownloads("Error loading downloads. Please try again later.");
      } finally {
        setLoadingDownloads(false);
      }
    };
    
    fetchDownloads();
  }, []);
  
  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoadingVideos(true);
        const response = await mediafileAPI.getByFileType("video");
        
        if (response.data.status === true && response.data.data) {
          const apiVideos: ApiVideo[] = response.data.data;
          
          // Transform API data to match our component structure
          const transformedVideos: Video[] = apiVideos.map((video: ApiVideo) => {
            // Extract a category based on the video fileName (just as an example)
            let category = "all";
            if (video.fileName.toLowerCase().includes("tắm") || video.fileName.toLowerCase().includes("sức khỏe")) {
              category = "health";
            } else if (video.fileName.toLowerCase().includes("ăn") || video.fileName.toLowerCase().includes("bú")) {
              category = "feeding";
            } else if (video.fileName.toLowerCase().includes("phát triển") || video.fileName.toLowerCase().includes("vận động")) {
              category = "development";
            }
            
            // Get author name from the populated Author object
            const authorName = video.Author ? 
              `${video.Author.firstName || ""} ${video.Author.lastName || ""}`.trim() : 
              "Chuyên gia NoteBaby";
            
            // Get author photo if available
            const authorPhoto = video.Author?.photo || null;
            
            return {
              id: video._id,
              title: video.fileName,
              duration: "5:00", // Example duration as it's not in the API response
              views: Math.floor(Math.random() * 50000) + 5000, // Random view count for demo
              author: authorName,
              authorPhoto: authorPhoto,
              thumbnail: video.fileUrl, // Use the video URL itself as the thumbnail source
              category: category,
              fileUrl: video.fileUrl
            };
          });
          
          setVideos(transformedVideos);
        } else {
          setErrorVideos("Failed to load videos");
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
        setErrorVideos("Error loading videos. Please try again later.");
      } finally {
        setLoadingVideos(false);
      }
    };
    
    fetchVideos();
  }, []);
  
  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoadingArticles(true);
        const response = await articlesAPI.getAll();
        
        if (response.data.status === true && response.data.data) {
          const apiArticles: ApiArticle[] = response.data.data;
          
          // Transform API data to match our component structure
          const transformedArticles: Article[] = apiArticles.map((article: ApiArticle) => {
            // Find the category id mapping from our categories
            const categoryTitle = article.Category?.Title || "";
            const categoryId = categoryIconMap[categoryTitle]?.id || "all";
            
            return {
              id: article._id,
              title: article.Title,
              description: article.Description || "",
              category: categoryId,
              author: `${article.Author?.firstName || ""} ${article.Author?.lastName || ""}`.trim(),
              authorAvatar: article.Author?.photo || "/placeholder.svg?height=40&width=40",
              readTime: `${article.ReadTime || 5} phút`,
              views: article.Views || 0,
              likes: article.Likes || 0,
              image: article.File?.fileUrl || "/placeholder.svg?height=200&width=300",
              tags: article.Tags || [],
              featured: false
            };
          });
          
          // Select 3 random articles as featured
          const shuffled = [...transformedArticles].sort(() => 0.5 - Math.random());
          const selectedFeatured = shuffled.slice(0, 3).map(article => ({
            ...article,
            featured: true
          }));
          
          setFeaturedArticles(selectedFeatured);
          setArticles(transformedArticles);
          
          // Update category counts based on actual articles
          if (categories.length > 1) {
            const updatedCategories = categories.map(category => {
              if (category.id === 'all') {
                return { ...category, count: transformedArticles.length };
              } else {
                const count = transformedArticles.filter(article => article.category === category.id).length;
                return { ...category, count };
              }
            });
            setCategories(updatedCategories);
          }
        } else {
          setErrorArticles("Failed to load articles");
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
        setErrorArticles("Error loading articles. Please try again later.");
      } finally {
        setLoadingArticles(false);
      }
    };
    
    fetchArticles();
  }, []);

  // Videos and experts will be fetched from API

  // This function will be used to filter articles based on search query and selected category
  const filterArticles = (articlesList: Article[]) => {
    return articlesList.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }
  
  // This function will be used to filter videos based on search query and selected category
  const filterVideos = (videosList: Video[]) => {
    return videosList.filter((video) => {
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || video.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }
  
  // This function will be used to filter downloads based on search query
  const filterDownloads = (downloadsList: Download[]) => {
    return downloadsList.filter((download) => {
      return download.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             download.description.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }

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
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Bộ lọc
                </Button>
                <CreateArticleModal onSuccess={() => window.location.reload()} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Danh mục</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Đang tải danh mục...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={() => window.location.reload()}
              >
                Thử lại
              </Button>
            </div>
          ) : (
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
                      <Icon className={`h-8 w-8 mx-auto mb-2 ${
                        selectedCategory === category.id ? "text-blue-700" : "text-blue-600"
                      }`} />
                      <h3 className={`font-medium text-sm ${
                        selectedCategory === category.id ? "text-blue-700" : ""
                      }`}>{category.name}</h3>
                      <p className="text-xs text-gray-500">{category.count} bài</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
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
              
              {loadingArticles ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Đang tải bài viết...</span>
                </div>
              ) : errorArticles ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                  {errorArticles}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2"
                    onClick={() => window.location.reload()}
                  >
                    Thử lại
                  </Button>
                </div>
              ) : filterArticles(featuredArticles).length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 mb-2 text-gray-400" />
                  <p>Không tìm thấy bài viết nổi bật phù hợp với danh mục đã chọn.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterArticles(featuredArticles).map((article) => (
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
                          <Badge variant="outline">{categories.find((c) => c.id === article.category)?.name || "Chung"}</Badge>
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
                              <AvatarFallback>{article.author ? article.author.charAt(0) : "U"}</AvatarFallback>
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
              )}
            </div>

            {/* Regular Articles */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tất cả bài viết</h2>
              
              {loadingArticles ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Đang tải bài viết...</span>
                </div>
              ) : errorArticles ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                  {errorArticles}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2"
                    onClick={() => window.location.reload()}
                  >
                    Thử lại
                  </Button>
                </div>
              ) : filterArticles(articles).length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                  <Search className="h-8 w-8 mb-2 text-gray-400" />
                  <p>Không tìm thấy bài viết phù hợp với danh mục đã chọn.</p>
                  {selectedCategory !== "all" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setSelectedCategory("all")}
                    >
                      Xem tất cả bài viết
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterArticles(articles).map((article) => (
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
                            {categories.find((c) => c.id === article.category)?.name || "Chung"}
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
                              <AvatarFallback>{article.author ? article.author.charAt(0) : "U"}</AvatarFallback>
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
              )}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Video hướng dẫn</h2>
                <Button 
                  onClick={() => setVideoUploadModalOpen(true)} 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Tải lên video
                </Button>
              </div>
              
              {loadingVideos ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Đang tải video...</span>
                </div>
              ) : errorVideos ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                  {errorVideos}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2"
                    onClick={() => window.location.reload()}
                  >
                    Thử lại
                  </Button>
                </div>
              ) : filterVideos(videos).length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                  <Play className="h-8 w-8 mb-2 text-gray-400" />
                  <p>Không có video nào hiện tại.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterVideos(videos).map((video) => (
                    <Card 
                      key={video.id} 
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedVideo(video);
                        setVideoDialogOpen(true);
                      }}
                    >
                      <div className="relative">
                        <div className="w-full h-48 bg-gray-100">
                          {/* Use video as poster (first frame) */}
                          <video 
                            src={video.fileUrl} 
                            className="w-full h-full object-cover" 
                            preload="metadata"
                          />
                        </div>
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
                          <div className="flex items-center gap-2">
                            {video.authorPhoto ? (
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={video.authorPhoto} />
                                <AvatarFallback>{video.author ? video.author.charAt(0) : "U"}</AvatarFallback>
                              </Avatar>
                            ) : null}
                            <span>{video.author}</span>
                          </div>
                          <span>{video.views.toLocaleString()} lượt xem</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Video Dialog */}
                <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
                  <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-black">
                    {selectedVideo && (
                      <>
                        <div className="relative pt-[56.25%] w-full">
                          <video 
                            className="absolute top-0 left-0 w-full h-full"
                            src={selectedVideo.fileUrl} 
                            controls 
                            autoPlay
                          />
                        </div>
                        <div className="p-4 bg-white">
                          <DialogTitle className="mb-2">{selectedVideo.title}</DialogTitle>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              {selectedVideo.authorPhoto ? (
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={selectedVideo.authorPhoto} />
                                  <AvatarFallback>
                                    {selectedVideo.author ? selectedVideo.author.charAt(0) : "U"}
                                  </AvatarFallback>
                                </Avatar>
                              ) : null}
                              <span>{selectedVideo.author}</span>
                            </div>
                            <span>{selectedVideo.views.toLocaleString()} lượt xem</span>
                          </div>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
                
                {/* Video Upload Modal */}
                <VideoUploadModal 
                  open={videoUploadModalOpen} 
                  onOpenChange={setVideoUploadModalOpen} 
                  onUploadSuccess={() => {
                    // Refresh the videos list after successful upload
                    const fetchVideos = async () => {
                      try {
                        setLoadingVideos(true);
                        const response = await mediafileAPI.getByFileType("video");
                        
                        if (response.data.status === true && response.data.data) {
                          const apiVideos: ApiVideo[] = response.data.data;
                          
                          // Transform API data to match our component structure
                          const transformedVideos: Video[] = apiVideos.map((video: ApiVideo) => {
                            // Generate a human-readable title from the filename if needed
                            const title = video.fileName || 'Untitled Video';
                            
                            // For demo, assume standard values
                            return {
                              id: video.id,
                              title: title,
                              duration: "00:00", // This would normally be calculated from the video
                              views: 0,
                              author: video.Author.firstName + ' ' + video.Author.lastName,
                              authorPhoto: video.Author.photo || null,
                              thumbnail: video.fileUrl, // Using video URL as thumbnail
                              category: "all", // Default category
                              fileUrl: video.fileUrl
                            };
                          });
                          
                          setVideos(transformedVideos);
                        } else {
                          setErrorVideos("Failed to load videos");
                        }
                      } catch (err) {
                        console.error("Error fetching videos:", err);
                        setErrorVideos("Error loading videos. Please try again later.");
                      } finally {
                        setLoadingVideos(false);
                      }
                    };
                    
                    fetchVideos();
                    toast({
                      title: "Success",
                      description: "Video uploaded and added to the library",
                    });
                  }}
                />
            </div>
          </TabsContent>

          <TabsContent value="experts" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Đội ngũ chuyên gia</h2>
              
              {loadingExperts ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Đang tải thông tin chuyên gia...</span>
                </div>
              ) : errorExperts ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                  {errorExperts}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2"
                    onClick={() => window.location.reload()}
                  >
                    Thử lại
                  </Button>
                </div>
              ) : experts.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                  <GraduationCap className="h-8 w-8 mb-2 text-gray-400" />
                  <p>Không có chuyên gia nào hiện tại.</p>
                </div>
              ) : (
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
              )}
            </div>
          </TabsContent>

          <TabsContent value="downloads" className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tài liệu tải về</h2>
                <Button 
                  onClick={() => setFileUploadModalOpen(true)} 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Tải lên tài liệu
                </Button>
              </div>
              
              {loadingDownloads ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Đang tải tài liệu...</span>
                </div>
              ) : errorDownloads ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                  {errorDownloads}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2"
                    onClick={() => window.location.reload()}
                  >
                    Thử lại
                  </Button>
                </div>
              ) : filterDownloads(downloads).length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                  <Download className="h-8 w-8 mb-2 text-gray-400" />
                  <p>Không có tài liệu nào hiện tại.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterDownloads(downloads).map((doc) => (
                    <Card key={doc.id} className="hover:shadow-lg transition-shadow">
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
                            <a 
                              href={doc.fileUrl} 
                              download={doc.title + getFileExtension(doc.fileUrl, doc.type)}
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                // For files from Cloudinary that might not download properly with just the download attribute
                                e.preventDefault();
                                fetch(doc.fileUrl)
                                  .then(response => response.blob())
                                  .then(blob => {
                                    // Create a blob URL for the file
                                    const blobUrl = URL.createObjectURL(blob);
                                    
                                    // Create a temporary link element
                                    const downloadLink = document.createElement('a');
                                    downloadLink.href = blobUrl;
                                    
                                    // Get file extension based on URL and file type
                                    const fileExtension = getFileExtension(doc.fileUrl, doc.type);
                                    
                                    // Set the download attribute with the filename including extension
                                    const fileName = doc.title + fileExtension;
                                    downloadLink.download = fileName;
                                    
                                    // Append to the document body, click it, and remove it
                                    document.body.appendChild(downloadLink);
                                    downloadLink.click();
                                    document.body.removeChild(downloadLink);
                                    
                                    // Release the blob URL
                                    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
                                  })
                                  .catch(err => {
                                    console.error("Download failed:", err);
                                    // Fallback to opening in a new tab
                                    window.open(doc.fileUrl, "_blank");
                                  });
                              }}
                            >
                              <Button className="w-full">
                                <Download className="h-4 w-4 mr-2" />
                                Tải về
                              </Button>
                            </a>
                            <div className="flex items-center mt-3 text-xs text-gray-500">
                              <span>Tác giả: </span>
                              {doc.authorPhoto ? (
                                <Avatar className="h-5 w-5 ml-2 mr-1">
                                  <AvatarImage src={doc.authorPhoto} />
                                  <AvatarFallback>{doc.author ? doc.author.charAt(0) : "U"}</AvatarFallback>
                                </Avatar>
                              ) : null}
                              <span>{doc.author}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* File Upload Modal */}
              <FileUploadModal 
                open={fileUploadModalOpen} 
                onOpenChange={setFileUploadModalOpen} 
                onUploadSuccess={() => {
                  // Refresh the downloads list after successful upload
                  const fetchDownloads = async () => {
                    try {
                      setLoadingDownloads(true);
                      const response = await mediafileAPI.getByFileType("other");
                      
                      if (response.data.status === true && response.data.data) {
                        const apiDownloads: ApiDownload[] = response.data.data;
                        
                        // Transform API data to match our component structure
                        const transformedDownloads: Download[] = apiDownloads.map((download: ApiDownload) => {
                          // Generate a human-readable title from the filename if needed
                          const title = download.fileName || 'Untitled Document';
                          
                          // For demo, assume standard values
                          return {
                            id: download.id,
                            title: title,
                            description: "Tài liệu được chia sẻ bởi cộng đồng",
                            type: download.fileType || "Document",
                            size: "1 MB", // This would normally be calculated from the file
                            downloads: 0,
                            fileUrl: download.fileUrl,
                            author: download.Author.firstName + ' ' + download.Author.lastName,
                            authorPhoto: download.Author.photo || null
                          };
                        });
                        
                        setDownloads(transformedDownloads);
                      } else {
                        setErrorDownloads("Failed to load downloads");
                      }
                    } catch (err) {
                      console.error("Error fetching downloads:", err);
                      setErrorDownloads("Error loading downloads. Please try again later.");
                    } finally {
                      setLoadingDownloads(false);
                    }
                  };
                  
                  fetchDownloads();
                  toast({
                    title: "Success",
                    description: "File uploaded and added to the library",
                  });
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
