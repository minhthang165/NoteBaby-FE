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
} from "lucide-react"

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

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function DashboardSidebar({ activeSection, onSectionChange, ...props }: DashboardSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-blue-500">
            <Baby className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">NoteBaby</h2>
            <p className="text-xs text-muted-foreground">Kỷ niệm của bé</p>
          </div>
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
                    <span className="text-xs text-muted-foreground">Ba của bé Minh</span>
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
