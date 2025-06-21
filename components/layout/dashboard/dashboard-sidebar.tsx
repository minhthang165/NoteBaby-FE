"use client"

import type * as React from "react"
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
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

// Mock data cho các bé
const babies = [
  {
    id: 1,
    name: "Bé Minh",
    birthDate: "2024-04-15",
    age: "8 tháng 15 ngày",
    avatar: "/placeholder.svg?height=40&width=40",
    gender: "boy",
    isActive: true,
  },
  {
    id: 2,
    name: "Bé An",
    birthDate: "2022-08-20",
    age: "2 tuổi 4 tháng",
    avatar: "/placeholder.svg?height=40&width=40",
    gender: "girl",
    isActive: false,
  },
  {
    id: 3,
    name: "Bé Khôi",
    birthDate: "2023-12-10",
    age: "1 tuổi",
    avatar: "/placeholder.svg?height=40&width=40",
    gender: "boy",
    isActive: false,
  },
]

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function DashboardSidebar({ activeSection, onSectionChange, ...props }: DashboardSidebarProps) {
  const [selectedBaby, setSelectedBaby] = useState(babies.find((baby) => baby.isActive) || babies[0])

  const handleBabyChange = (baby: (typeof babies)[0]) => {
    setSelectedBaby(baby)
    // Có thể thêm logic để cập nhật dữ liệu theo bé được chọn
    console.log("Switched to baby:", baby.name)
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-blue-500">
            <Baby className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">NotBy</h2>
            <p className="text-xs text-muted-foreground">Kỷ niệm của bé</p>
          </div>
        </div>

        {/* Baby Selector */}
        <div className="px-2 pb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-background hover:bg-accent cursor-pointer transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedBaby.avatar || "/placeholder.svg"} />
                  <AvatarFallback
                    className={
                      selectedBaby.gender === "boy" ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"
                    }
                  >
                    {selectedBaby.name.split(" ")[1]?.charAt(0) || selectedBaby.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{selectedBaby.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedBaby.age}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[280px]" align="start">
              <div className="p-2">
                <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Chọn bé để theo dõi</p>
                {babies.map((baby) => (
                  <DropdownMenuItem
                    key={baby.id}
                    className="flex items-center gap-3 p-3 cursor-pointer"
                    onClick={() => handleBabyChange(baby)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={baby.avatar || "/placeholder.svg"} />
                      <AvatarFallback
                        className={baby.gender === "boy" ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"}
                      >
                        {baby.name.split(" ")[1]?.charAt(0) || baby.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{baby.name}</p>
                      <p className="text-xs text-muted-foreground">{baby.age}</p>
                    </div>
                    {selectedBaby.id === baby.id && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer border-t mt-2">
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
                    <AvatarImage src="/placeholder.svg?height=24&width=24" />
                    <AvatarFallback>NV</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium">Nguyễn Văn A</span>
                    <span className="text-xs text-muted-foreground">Ba của {babies.length} bé</span>
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
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
