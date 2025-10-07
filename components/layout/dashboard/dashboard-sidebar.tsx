"use client"

import type * as React from "react"
import { useEffect } from "react"
import {
  BarChart3,
  BookOpen,
  Calendar,
  Heart,
  Home,
  Settings,
  User,
  Baby,
  Camera,
  Share2,
  Bell,
  LogOut,
  ChevronDown,
  Plus,
  Check,
  UserPlus,
  Users,
  Link,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { QuickStats } from "./quick-stats"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from 'react';
import { toast, useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/utils';
import { getDataFromJWT } from '@/lib/utils';

const navigationItems = [
  {
    title: "Tổng quan",
    url: "#overview",
    icon: Home,
  },
  {
    title: "Thống kê",
    url: "#statistics",
    icon: BarChart3,
  },
  {
    title: "Nhật ký phát triển",
    url: "#development",
    icon: BookOpen,
  },
  {
    title: "Theo dõi sức khỏe",
    url: "#health",
    icon: Heart,
  },
  {
    title: "Lịch học & Thời khóa biểu",
    url: "#schedule",
    icon: Calendar,
  },
]

const quickActions = [
  {
    title: "Thêm ảnh mới",
    icon: Camera,
  },
  {
    title: "Ghi chú phát triển",
    icon: Plus,
  },
  {
    title: "Chia sẻ kỷ niệm",
    icon: Share2,
  },
]

import { babiesAPI } from '@/lib/api/babiesApi';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface DashboardSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  selectedBabyId: string | null
  setSelectedBabyId: (id: string | null) => void
  babies: any[]
}

export function DashboardSidebar(props: DashboardSidebarProps) {
  const { activeSection, onSectionChange, selectedBabyId, setSelectedBabyId, babies } = props;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ open: boolean, babyId: string | null }>({ open: false, babyId: null });
  // State for add baby modal
  const [showAddBabyModal, setShowAddBabyModal] = useState(false);
  const [newBaby, setNewBaby] = useState({ firstName: '', lastName: '', dob: '', gender: 'Male' });
  const [addLoading, setAddLoading] = useState(false);
  // Helper to format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN");
  };
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Babies state (local, to update after add)
  const [babiesList, setBabiesList] = useState<any[]>(babies);

  // Fetch babies from BE on mount or when babies prop changes
  useEffect(() => {
    if (!babies || babies.length === 0) {
      babiesAPI.getAll().then(res => {
        setBabiesList(res.babies);
        if (res.babies.length > 0 && !selectedBabyId) setSelectedBabyId(res.babies[0]._id);
      });
    } else {
      setBabiesList(babies);
    }
  }, [babies, selectedBabyId, setSelectedBabyId]);

  const router = useRouter();

  // Get user data from JWT on component mount
  useEffect(() => {
    const handleAuth = () => {
      setIsLoading(true);
      try {
        const data = getDataFromJWT();
        if (data) {
          setUserData(data);
        } else {
          router.push('/sign-in');
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    handleAuth();
  }, [router]);


  const handleDeleteBaby = async (babyId: string) => {
    setShowDeleteConfirm({ open: true, babyId });
  };

  const confirmDeleteBaby = async () => {
    const babyId = showDeleteConfirm.babyId;
    if (!babyId) return;
    try {
      await babiesAPI.delete(babyId);
      toast({ title: 'Đã xóa bé thành công' });
      setTimeout(() => {
       window.location.reload();
      }, 500);
    } catch (err) {
      toast({ title: 'Xóa bé thất bại!' });
    } finally {
      // Always reload babies list after delete attempt
      const res = await babiesAPI.getAll();
      let babiesArr = res?.babies || res?.data?.data?.babies || [];
      setBabiesList(babiesArr);
      if (selectedBabyId === babyId) setSelectedBabyId(babiesArr.length > 0 ? babiesArr[0]._id : null);
      setShowDeleteConfirm({ open: false, babyId: null });
    }
  };
  const handleLogout = () => {
    logout();
    router.push('/sign-in');
  };

  const handleAddBaby = async () => {
    setAddLoading(true);
    try {
      const currentUser = getDataFromJWT() as { id?: string; sub?: string } | null;
      const userId = currentUser?.id || currentUser?.sub;
      if (!userId) {
        toast({ title: 'Không thể xác thực người dùng. Vui lòng đăng nhập lại.' });
        setAddLoading(false);
        return;
      }
      const payload = {
        ...newBaby,
        gender: newBaby.gender as 'Male' | 'Female' | 'Other',
        parentId: userId,
      };
      await babiesAPI.create(payload);
      // Lấy lại danh sách bé mới nhất từ API
      const res = await babiesAPI.getAll();
      let babiesArr = res.babies;
      if (!babiesArr && res.data && res.data.data && Array.isArray(res.data.data.babies)) {
        babiesArr = res.data.data.babies;
      }
      if (Array.isArray(babiesArr)) {
        setBabiesList(babiesArr.filter((b: any) => b.parentId === userId));
      }
      setShowAddBabyModal(false);
      setNewBaby({ firstName: '', lastName: '', dob: '', gender: 'Male' });
      toast({ title: 'Tạo bé mới thành công' });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err: any) {
      console.error('Lỗi tạo bé:', err);
      toast({ title: 'Tạo bé mới thất bại!' });
    } finally {
      setAddLoading(false);
    }
  };
  return (
    <>
      <Sidebar {...props}>
        <SidebarHeader>
          <div className="flex items-center gap-3 px-2 py-4">
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-blue-500">
                <Baby className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">NotBy</h2>
                <p className="text-xs text-muted-foreground">Kỷ niệm của bé</p>
              </div>
            </a>
          </div>
          {/* Baby Selector */}
          <div className="px-2 pb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {selectedBabyId && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-background hover:bg-accent cursor-pointer transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={babiesList.find(b => b._id === selectedBabyId)?.avatar || "/placeholder.svg"} />
                      <AvatarFallback className={babiesList.find(b => b._id === selectedBabyId)?.gender === "Male" ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"}>
                        {babiesList.find(b => b._id === selectedBabyId)?.firstName?.charAt(0) || "B"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                    <p className="font-medium text-sm">Bé {babiesList.find(b => b._id === selectedBabyId)?.firstName}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(babiesList.find(b => b._id === selectedBabyId)?.dob)}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[280px]" align="start">
              <div className="p-2">
                <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Chọn bé để theo dõi</p>
                {babiesList.map((baby) => (
                  <DropdownMenuItem
                    key={baby._id}
                    className="flex items-center gap-3 p-3 cursor-pointer"
                    onClick={() => setSelectedBabyId(baby._id)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={baby.avatar || "/placeholder.svg"} />
                      <AvatarFallback className={baby.gender === "Male" ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"}>
                        {baby.firstName?.charAt(0) || "B"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{baby.lastName} {baby.firstName}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(baby.dob)}</p>
                    </div>
                    {selectedBabyId === baby._id && <Check className="h-4 w-4 text-primary" />}
                    {/* Delete button */}
                    <button
                      className="ml-2 p-1 rounded hover:bg-red-100 text-red-600"
                      title="Xóa bé"
                      onClick={e => { e.stopPropagation(); handleDeleteBaby(baby._id); }}
                      tabIndex={-1}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M9 6v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6m-6 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                    </button>
      {/* Delete Baby Confirm Dialog */}
      <AlertDialog open={showDeleteConfirm.open} onOpenChange={open => setShowDeleteConfirm(s => ({ ...s, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc muốn xóa hồ sơ bé này?</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="py-4">Hành động này không thể hoàn tác.</div>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm({ open: false, babyId: null })}>Hủy</Button>
            <Button variant="destructive" onClick={confirmDeleteBaby}>Xóa</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  onSelect={e => e.preventDefault()}
                  onClick={() => setShowAddBabyModal(true)}
                  className="flex items-center gap-3 p-3 cursor-pointer border-t mt-2"
                >
                  <div className="h-8 w-8 rounded-full bg-dashed border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Thêm bé mới</p>
                    <p className="text-xs text-muted-foreground">Theo dõi thêm con khác</p>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu chính</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeSection === item.url.replace("#", "")}
                    onClick={() => onSectionChange(item.url.replace("#", ""))}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Thao tác nhanh</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((action) => (
                <SidebarMenuItem key={action.title}>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <action.icon />
                      <span>{action.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Baby Stats Summary */}
        <SidebarGroup>
          <SidebarGroupLabel>Thống kê nhanh</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Ảnh tháng này</span>
                <Badge variant="secondary">24</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cột mốc mới</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Lịch hẹn</span>
                <Badge variant="outline">2</Badge>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={userData?.photo || "/placeholder.svg?height=24&width=24"} />
                    <AvatarFallback>
                      {isLoading ? '...' : userData?.firstName ? userData.firstName.charAt(0) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    {isLoading ? (
                      <span className="text-sm font-medium">Đang tải...</span>
                    ) : (
                      <>
                        <span className="text-sm font-medium">
                          {userData?.firstName && userData?.lastName 
                            ? `${userData.firstName} ${userData.lastName}` 
                            : userData?.email 
                              ? userData.email.split('@')[0] 
                              : 'Người dùng'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {userData?.role || ''} {babies.length > 0 ? `- Quản lý ${babies.length} bé` : ''}
                        </span>
                      </>
                    )}
                  </div>
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Thông tin cá nhân
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Baby className="mr-2 h-4 w-4" />
                  Quản lý các bé
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Cài đặt
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  Thông báo
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span onClick={handleLogout} style={{ cursor: 'pointer', width: '100%' }}>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu chính</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeSection === item.url.replace("#", "")}
                      onClick={() => onSectionChange(item.url.replace("#", ""))}
                    >
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Thao tác nhanh</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickActions.map((action) => (
                  <SidebarMenuItem key={action.title}>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <action.icon />
                        <span>{action.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* Baby Stats Summary */}
          <SidebarGroup>
            <SidebarGroupLabel>Thống kê nhanh</SidebarGroupLabel>
            <SidebarGroupContent>
              <QuickStats selectedBabyId={selectedBabyId} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={userData?.photo || "/placeholder.svg?height=24&width=24"} />
                      <AvatarFallback>
                        {isLoading ? '...' : userData?.firstName ? userData.firstName.charAt(0) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left">
                      {isLoading ? (
                        <span className="text-sm font-medium">Đang tải...</span>
                      ) : (
                        <>
                          <span className="text-sm font-medium">
                            {userData?.firstName && userData?.lastName 
                              ? `${userData.firstName} ${userData.lastName}` 
                              : userData?.email 
                                ? userData.email.split('@')[0] 
                                : 'Người dùng'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {userData?.role || ''} {babiesList.length > 0 ? `- Quản lý ${babiesList.length} bé` : ''}
                          </span>
                        </>
                      )}
                    </div>
                    <ChevronDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Thông tin cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Baby className="mr-2 h-4 w-4" />
                    Quản lý các bé
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Cài đặt
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    Thông báo
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span onClick={handleLogout} style={{ cursor: 'pointer', width: '100%' }}>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      {/* Modal Add Baby nằm ngoài Sidebar để tránh lỗi overlay */}
      <AlertDialog open={showAddBabyModal} onOpenChange={setShowAddBabyModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thêm hồ sơ bé mới</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <Input placeholder="Họ của bé" value={newBaby.lastName} onChange={e => setNewBaby({ ...newBaby, lastName: e.target.value })} />
            <Input placeholder="Tên của bé" value={newBaby.firstName} onChange={e => setNewBaby({ ...newBaby, firstName: e.target.value })} />
            <Input type="date" value={newBaby.dob} onChange={e => setNewBaby({ ...newBaby, dob: e.target.value })} />
            <select className="w-full p-2 border rounded-md" value={newBaby.gender} onChange={e => setNewBaby({ ...newBaby, gender: e.target.value })}>
              <option value="Male">Bé trai</option>
              <option value="Female">Bé gái</option>
              <option value="Other">Khác</option>
            </select>
          </div>
          <AlertDialogFooter>
             <Button variant="outline" onClick={() => setShowAddBabyModal(false)} disabled={addLoading}>Hủy</Button>
            <Button onClick={handleAddBaby} disabled={addLoading}>
              {addLoading ? 'Đang tạo...' : 'Lưu'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
