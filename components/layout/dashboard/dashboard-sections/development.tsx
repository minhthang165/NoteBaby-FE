"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Camera, Star, Calendar, Edit, Trash2, X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { diaryEntriesAPI } from "@/lib/api/diaryEntriesAPI"

export function DevelopmentSection({ baby }: { baby: any }) { 
  const [milestones, setMilestones] = useState<DiaryEntry[]>([]);
  // Pagination for milestones
  const [milestonePage, setMilestonePage] = useState(1);
  const milestonePageSize = 5;
  // Lọc milestones theo bé và danh mục
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const filteredMilestones = milestones
    .filter(milestone => {
      let milestoneChildId = typeof milestone.childId === 'object' && milestone.childId !== null ? milestone.childId._id : milestone.childId;
      return milestoneChildId === (baby && baby._id);
    })
    .filter(milestone => selectedCategory === "Tất cả" || milestone.category === selectedCategory.toLowerCase())
    .sort((a, b) => {
      const dateA = new Date(a.created_at || '').getTime();
      const dateB = new Date(b.created_at || '').getTime();
      return dateB - dateA;
    });
  const milestoneTotalPages = Math.ceil(filteredMilestones.length / milestonePageSize) || 1;
  const paginatedMilestones = filteredMilestones.slice((milestonePage - 1) * milestonePageSize, milestonePage * milestonePageSize);
  // Helper to add activity to OverviewSection's localStorage for current baby
  const addActivity = (activity: { type: string; content: string; icon: string; date?: string }) => {
    if (!baby?._id) return;
    const key = `baby-activities-${baby._id}`;
    const prev = typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem(key) || '[]')) : [];
    const newActivity = {
      id: Date.now().toString(),
      type: activity.type,
      content: activity.content,
      icon: activity.icon,
      date: activity.date || new Date().toISOString(),
      time: '', // Will be formatted in OverviewSection
    };
    localStorage.setItem(key, JSON.stringify([newActivity, ...prev]));
  }
  const { toast } = useToast();
  type DiaryEntry = {
    _id?: string;
    title: string;
    content: string;
    category: string;
    imageUrls?: string[];
    childId?: any;
    created_at?: string;
  };

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [viewingImages, setViewingImages] = useState<string[]>([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [newEntryForm, setNewEntryForm] = useState<Partial<DiaryEntry>>({
    title: '',
    category: '',
    content: ''
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<DiaryEntry | null>(null);

  const fetchDiaryEntries = async (childId?: string) => {
    setLoading(true);
    try {
      // Truyền childId vào API nếu có
      const res = await diaryEntriesAPI.getAll(childId ? { childId } : undefined);
      setMilestones(res.data?.data?.data || []);
    } catch (err) {
      setMilestones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (baby && baby._id) {
      fetchDiaryEntries(baby._id);
    } else {
      setMilestones([]);
    }
  }, [baby?._id]);

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await diaryEntriesAPI.remove(deletingId);
      addActivity({
        type: "milestone",
        content: `Xóa cột mốc phát triển`,
        icon: "Trash2",
      });
      toast({
        title: "Đã xóa cột mốc thành công!",
        description: "Cột mốc đã được xóa khỏi hệ thống.",
        variant: "default",
        className: "border-green-500 border-2",
        duration: 2000,
      });
      await fetchDiaryEntries(baby?._id);
      setShowDeleteDialog(false);
      setDeletingId(null);
      setIsDeleting(false);
    } catch (err) {
      toast({
        title: "Xóa thất bại!",
        description: "Có lỗi xảy ra khi xóa cột mốc.",
        variant: "destructive",
        className: "border-red-500 border-2",
        duration: 2000,
      });
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setShowDeleteDialog(true);
  };

  const handleCreateOrEdit = async (data: Partial<DiaryEntry>, files?: File[]) => {
    setModalLoading(true);
    try {
      const formData = new FormData();
      let childId = data.childId;

      if (!data._id && baby && baby._id) {
        childId = baby._id;
      }
      if (typeof childId === 'object' && childId !== null && '_id' in childId) {
        childId = childId._id;
      }

      formData.append('title', data.title || '');
      formData.append('content', data.content || '');
      formData.append('category', data.category || '');
      formData.append('childId', childId || '');
      
      // Xử lý ảnh mới
      if (files && files.length > 0) {
        files.forEach(file => {
          formData.append('images', file);
        });
      }

      // Xử lý ảnh cũ khi update
      if (data._id && data.imageUrls) {
        formData.append('existingImages', JSON.stringify(data.imageUrls));
      }

      // Debug form data
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      if (data._id) {
        await diaryEntriesAPI.update(data._id, formData);
        addActivity({
          type: "milestone",
          content: `Cập nhật cột mốc: ${data.title || ''}`,
          icon: "Edit",
        });
        toast({
          title: "Cập nhật cột mốc thành công!",
          description: "Thông tin cột mốc đã được cập nhật.",
          variant: "default",
          className: "border-green-500 border-2",
          duration: 2000,
        });
      } else {
        await diaryEntriesAPI.create(formData);
        addActivity({
          type: "milestone",
          content: `Thêm cột mốc mới: ${data.title || ''}`,
          icon: "Plus",
        });
        toast({
          title: "Thêm cột mốc thành công!",
          description: "Cột mốc mới đã được tạo cho bé.",
          variant: "default",
          className: "border-green-500 border-2",
          duration: 2000,
        });
      }
      await fetchDiaryEntries(baby?._id);
      setShowModal(false);
      setEditingEntry(null);
      setModalLoading(false);
    } catch (err) {
      toast({
        title: "Lỗi!",
        description: "Có lỗi xảy ra khi tạo/cập nhật cột mốc.",
        variant: "destructive",
        className: "border-red-500 border-2",
        duration: 2000,
      });
      setModalLoading(false);
    }
  };

  const categories = ["Tất cả", "Vận động", "Ngôn ngữ", "Dinh dưỡng", "Xã hội", "Khác"];

  const ImageUpload = ({ onImagesSelected }: { onImagesSelected: (files: File[]) => void }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        onImagesSelected(files);
      }
    };

    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" id="image-upload" />
        <label htmlFor="image-upload" className="cursor-pointer">
          <Camera className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 mb-2">Nhấp để chọn ảnh hoặc kéo thả vào đây</p>
          <p className="text-sm text-gray-500">Hỗ trợ JPG, PNG, GIF (tối đa 10MB mỗi ảnh)</p>
        </label>
      </div>
    );
  };

  const ImageViewer = ({ images, isOpen, onClose }: { images: string[]; isOpen: boolean; onClose: () => void }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="relative max-w-4xl max-h-full p-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
          >
            <X className="h-6 w-6" />
          </button>

          {images.length > 0 && (
            <>
              <img
                src={images[currentIndex] || "/placeholder.svg"}
                alt={`Ảnh ${currentIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full">
                    {currentIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const handleViewImages = (milestoneId: string) => {
    const milestone = milestones.find((m) => m._id === milestoneId);
    if (milestone && milestone.imageUrls) {
      setViewingImages(milestone.imageUrls);
      setCurrentMilestone(milestoneId);
      setShowImageModal(true);
    }
  };

  const handleImageUpload = (files: File[]) => {
    setSelectedImages(files);
    // Ở đây bạn có thể xử lý upload ảnh lên server
    console.log("Uploaded files:", files);
  };

  function MilestoneDetailModal({
    milestone,
    isOpen,
    onClose
  }: {
    milestone: DiaryEntry | null;
    isOpen: boolean;
    onClose: () => void;
  }) {
    if (!isOpen || !milestone) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{milestone.title}</h2>
                <div className="flex gap-2">
                  <Badge variant="outline">{milestone.category}</Badge>
                  <span className="text-sm text-gray-600">
                    {milestone.created_at ? new Date(milestone.created_at).toLocaleDateString("vi-VN") : ""}
                  </span>
                </div>
              </div>
              <Button variant="ghost" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Mô tả chi tiết</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{milestone.content}</p>
              </div>

              {milestone.imageUrls && milestone.imageUrls.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Ảnh kỷ niệm ({milestone.imageUrls.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {milestone.imageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Ảnh ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => {
                          setViewingImages(milestone.imageUrls || []);
                          setCurrentImageIndex(index);
                          setShowImageModal(true);
                          onClose();
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Đóng
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingEntry(milestone);
                  setShowModal(true);
                  onClose();
                }}
              >
                Chỉnh sửa
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function DiaryEntryModal({
    isOpen,
    onClose,
    onSave,
    initialData,
    loading,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<DiaryEntry>, fileList?: File[]) => void;
    initialData?: Partial<DiaryEntry>;
    loading?: boolean;
  }) {
    const [form, setForm] = useState<Partial<DiaryEntry>>(initialData || {});
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
      // Preserve existing childId when editing
      const formData = initialData ? {
        ...initialData,
        childId: initialData.childId // Make sure childId is preserved
      } : {};
      setForm(formData);
      setFiles([]);
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) setFiles(Array.from(e.target.files));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.title || !form.category) {
        console.error('Missing required fields');
        return;
      }
      let childId = form.childId;
      // Nếu là tạo mới, luôn lấy từ baby._id nếu có
      if (!form._id && baby && baby._id) {
        childId = baby._id;
      }
      // Nếu là update, giữ nguyên childId của entry đang chỉnh sửa
      if (typeof childId === 'object' && childId !== null && '_id' in childId) {
        childId = childId._id;
      }
      const formData = {
        ...form,
        childId: childId,
        content: form.content || '',
        category: form.category
      };
      console.log('Submitting form data:', formData);
      onSave(formData, files);
    };

    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">{form._id ? "Chỉnh sửa cột mốc" : "Thêm cột mốc mới"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tiêu đề *</label>
                <input name="title" type="text" required className="w-full p-2 border rounded-md" value={form.title || ""} onChange={handleChange} placeholder="VD: Lần đầu bò" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Danh mục *</label>
                <select name="category" required className="w-full p-2 border rounded-md" value={form.category || ""} onChange={handleChange}>
                  <option value="">Chọn danh mục</option>
                  <option value="vận động">Vận động</option>
                  <option value="ngôn ngữ">Ngôn ngữ</option>
                  <option value="dinh dưỡng">Dinh dưỡng</option>
                  <option value="xã hội">Xã hội</option>
                  <option value="khác">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mô tả chi tiết</label>
                <textarea name="content" className="w-full p-2 border rounded-md" value={form.content || ""} onChange={handleChange} rows={3} placeholder="Mô tả chi tiết về cột mốc này..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ảnh kỷ niệm</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    id="modal-image-upload" 
                  />
                  <label htmlFor="modal-image-upload" className="cursor-pointer">
                    <Camera className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 mb-2">Nhấp để chọn ảnh hoặc kéo thả vào đây</p>
                    <p className="text-sm text-gray-500">Hỗ trợ JPG, PNG, GIF (tối đa 10MB mỗi ảnh)</p>
                  </label>
                </div>
                {files.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Ảnh đã chọn ({files.length}):</p>
                    <div className="grid grid-cols-3 gap-2">
                      {files.map((file, idx) => (
                        <div key={idx} className="relative">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`Preview ${idx + 1}`} 
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <Button type="submit" className="w-full" disabled={loading}>{form._id ? "Lưu" : "Thêm"}</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nhật ký phát triển</h1>
        <p className="text-gray-600 mt-2">Ghi lại những cột mốc quan trọng trong sự phát triển của bé</p>
      </div>

      <Tabs defaultValue="milestones" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="milestones">Cột mốc phát triển</TabsTrigger>
          <TabsTrigger value="add-new">Thêm mới</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="space-y-6">
          {/* Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button 
                    key={category} 
                    variant={selectedCategory === category ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Milestones List (from API) */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
            ) : filteredMilestones.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Không có nhật ký phát triển nào.</div>
            ) : (
              <>
                {paginatedMilestones.map((milestone) => (
                  <Card key={milestone._id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{milestone.title}</CardTitle>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {milestone.created_at ? new Date(milestone.created_at).toLocaleDateString("vi-VN") : ""}
                            </span>
                            <Badge variant="secondary">{milestone.childId?.firstName || ""}</Badge>
                            <Badge variant="outline">{milestone.category}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => { setEditingEntry(milestone); setShowModal(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => milestone._id && handleDeleteClick(milestone._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{milestone.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Camera className="h-4 w-4" />
                          {milestone.imageUrls?.length || 0} ảnh
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewImages(milestone._id ?? "")}
                            disabled={!milestone._id}
                          >
                            <ImageIcon className="h-4 w-4 mr-1" />
                            Xem ảnh
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedMilestone(milestone);
                              setShowDetailModal(true);
                            }}
                          >
                            Xem chi tiết
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {/* Pagination controls for milestones */}
                {milestoneTotalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => setMilestonePage(milestonePage - 1)} disabled={milestonePage === 1}>
                      Trước
                    </Button>
                    <span className="text-sm">Trang {milestonePage} / {milestoneTotalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => setMilestonePage(milestonePage + 1)} disabled={milestonePage === milestoneTotalPages}>
                      Sau
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="add-new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thêm cột mốc phát triển mới</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                  <Input 
                    placeholder="VD: Lần đầu bò" 
                    value={newEntryForm.title}
                    onChange={(e) => setNewEntryForm(prev => ({...prev, title: e.target.value}))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newEntryForm.category}
                    onChange={(e) => setNewEntryForm(prev => ({...prev, category: e.target.value}))}
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="vận động">Vận động</option>
                    <option value="ngôn ngữ">Ngôn ngữ</option>
                    <option value="dinh dưỡng">Dinh dưỡng</option>
                    <option value="xã hội">Xã hội</option>
                    <option value="khác">Khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết</label>
                <Textarea
                  placeholder="Mô tả chi tiết về cột mốc này, cảm xúc của bạn và những điều đặc biệt..."
                  rows={4}
                  value={newEntryForm.content}
                  onChange={(e) => setNewEntryForm(prev => ({...prev, content: e.target.value}))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh kỷ niệm</label>
                <ImageUpload onImagesSelected={handleImageUpload} />

                {selectedImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Ảnh đã chọn ({selectedImages.length}):</p>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file) || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => setSelectedImages((prev) => prev.filter((_, i) => i !== index))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Thêm ảnh
                </Button>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Đánh dấu là cột mốc quan trọng</span>
                </label>
              </div>

              <div className="flex gap-4">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    if (!newEntryForm.title || !newEntryForm.category) {
                      return;
                    }
                    handleCreateOrEdit(newEntryForm, selectedImages);
                 
                    setNewEntryForm({
                      title: '',
                      category: '',
                      content: ''
                    });
                    setSelectedImages([]);
                  }}
                >
                  Lưu cột mốc
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <ImageViewer images={viewingImages} isOpen={showImageModal} onClose={() => setShowImageModal(false)} />
      <DiaryEntryModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingEntry(null); }}
        onSave={handleCreateOrEdit}
        initialData={editingEntry || undefined}
        loading={modalLoading}
      />
      <MilestoneDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        milestone={selectedMilestone}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Cột mốc này sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className={isDeleting ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


