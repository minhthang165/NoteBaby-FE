"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cloudinaryAPI } from "@/lib/api/cloudinaryAPI"
import { mediafileAPI } from "@/lib/api/mediafileAPI"
import { articlesAPI } from "@/lib/api/articleAPI"
import { categoryAPI } from "@/lib/api/categoryAPI"
import { getAuthorId } from "@/lib/utils"
import { Plus, Loader2, Upload, FileText, Check } from "lucide-react"

// Define type for category from API
interface ApiCategory {
  _id: string;
  Title: string;
  created_at: string;
  updated_at: string;
  __v: number;
  id: string;
}

interface CreateArticleProps {
  onSuccess?: () => void;
}

export function CreateArticleModal({ onSuccess }: CreateArticleProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form data
  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    content: "",
    fileId: "",
    cloudinaryUrl: "",
    tags: "",
    readTime: 5,
    description: ""
  })

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll()
        if (response.data.status === true && response.data.data) {
          setCategories(response.data.data)
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Failed to load categories. Please try again later.")
      }
    }

    if (open) {
      fetchCategories()
    }
  }, [open])

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      
      // Create file preview URL
      const reader = new FileReader()
      reader.onload = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle form field changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      categoryId: value
    })
  }

  // Reset the form
  const resetForm = () => {
    setFormData({
      categoryId: "",
      title: "",
      content: "",
      fileId: "",
      cloudinaryUrl: "",
      tags: "",
      readTime: 5,
      description: ""
    })
    setSelectedFile(null)
    setFilePreview(null)
    setStep(1)
    setError(null)
    setSuccess(null)
    setUploadProgress(0)
  }

  // Close modal and reset form
  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      resetForm()
    }, 300) // Delay to allow animation to complete
  }

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      // Step 1: Upload file to Cloudinary
      if (!selectedFile) {
        throw new Error("Please select a file to upload")
      }

      // Create FormData for file upload
      const fileFormData = new FormData()
      fileFormData.append('file', selectedFile)
      
      setUploadProgress(20)
      const cloudinaryResponse = await cloudinaryAPI.upload(fileFormData)
      
      if (!cloudinaryResponse.data.status || !cloudinaryResponse.data.data) {
        throw new Error("Failed to upload file to Cloudinary")
      }
      
      const fileUrl = cloudinaryResponse.data.data
      setFormData({
        ...formData,
        cloudinaryUrl: fileUrl
      })
      
      setUploadProgress(50)
      
      // Step 2: Create MediaFile
      const authorId = getAuthorId()
      
      const mediaFileData = {
        fileUrl: fileUrl,
        fileName: selectedFile.name || "article_attachment",
        fileType: "image", // Can be dynamic based on file type
        Author: authorId
      }
      
      const mediaFileResponse = await mediafileAPI.create(mediaFileData)
      
      if (!mediaFileResponse.data.status || !mediaFileResponse.data.data) {
        throw new Error("Failed to create media file record")
      }
      
      const mediaFileId = mediaFileResponse.data.data._id
      
      setUploadProgress(75)
      
      // Step 3: Create Article
      const articleData = {
        CategoryId: formData.categoryId,
        Title: formData.title,
        Content: formData.content,
        FileId: mediaFileId,
        Author: authorId,
        Likes: 0,
        Views: 0,
        Tags: formData.tags.split(',').map(tag => tag.trim()),
        ReadTime: formData.readTime,
        Description: formData.description
      }
      
      const articleResponse = await articlesAPI.create(articleData)
      
      if (!articleResponse.data.status) {
        throw new Error("Failed to create article")
      }
      
      setUploadProgress(100)
      setSuccess("Article created successfully!")
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }
      
      // Close the modal after success
      setTimeout(() => {
        handleClose()
      }, 2000)
      
    } catch (err: any) {
      console.error("Error creating article:", err)
      setError(err.message || "Failed to create article. Please try again.")
      setUploadProgress(0)
    } finally {
      setIsLoading(false)
    }
  }

  // Next step in the form
  const handleNextStep = () => {
    // Basic validation for each step
    if (step === 1) {
      if (!formData.title || !formData.categoryId) {
        setError("Please fill in all required fields")
        return
      }
      setError(null)
      setStep(2)
    } else if (step === 2) {
      if (!formData.content || !formData.description) {
        setError("Please fill in all required fields")
        return
      }
      setError(null)
      setStep(3)
    }
  }

  // Previous step in the form
  const handlePrevStep = () => {
    setError(null)
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Đăng bài viết mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Đăng bài viết mới - Thông tin cơ bản"}
            {step === 2 && "Đăng bài viết mới - Nội dung"}
            {step === 3 && "Đăng bài viết mới - Đính kèm hình ảnh"}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-4 flex items-center">
            <Check className="h-4 w-4 mr-2" />
            {success}
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Danh mục *
              </Label>
              <div className="col-span-3">
                <Select 
                  value={formData.categoryId} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.Title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Tiêu đề *
              </Label>
              <Input
                id="title"
                name="title"
                className="col-span-3"
                placeholder="Nhập tiêu đề bài viết"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                id="tags"
                name="tags"
                className="col-span-3"
                placeholder="Nhập tags, ngăn cách bằng dấu phẩy"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="readTime" className="text-right">
                Thời gian đọc (phút)
              </Label>
              <Input
                id="readTime"
                name="readTime"
                type="number"
                className="col-span-3"
                value={formData.readTime}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Mô tả ngắn *
              </Label>
              <Textarea
                id="description"
                name="description"
                className="col-span-3"
                placeholder="Nhập mô tả ngắn cho bài viết"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right mt-2">
                Nội dung *
              </Label>
              <Textarea
                id="content"
                name="content"
                className="col-span-3"
                placeholder="Nhập nội dung bài viết"
                value={formData.content}
                onChange={handleChange}
                rows={10}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="file" className="text-right mt-2">
                Hình ảnh bài viết
              </Label>
              <div className="col-span-3 space-y-4">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="border border-gray-300 rounded-md p-2"
                />
                {filePreview && (
                  <div className="border rounded-md p-2">
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="h-40 object-contain mx-auto" 
                    />
                  </div>
                )}
                {!selectedFile && (
                  <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-gray-500">
                    <Upload className="h-8 w-8 mb-2" />
                    <p>Kéo thả file hoặc bấm vào đây để chọn file</p>
                    <p className="text-sm">Chấp nhận: JPG, PNG, GIF</p>
                  </div>
                )}
              </div>
            </div>
            
            {uploadProgress > 0 && (
              <div className="col-span-4 space-y-2">
                <div className="text-sm text-gray-500 flex justify-between">
                  <span>Đang tải lên...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex justify-between">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handlePrevStep}>
              Quay lại
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            {step < 3 ? (
              <Button type="button" onClick={handleNextStep}>
                Tiếp tục
              </Button>
            ) : (
              <Button 
                type="button" 
                onClick={handleSubmit}
                disabled={isLoading || !selectedFile}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Đăng bài
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}