"use client"

import { useState } from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Baby, Badge, Calendar, Camera } from "lucide-react"
import { OverviewSection } from "@/components/layout/dashboard/dashboard-sections/overview"
import { StatisticsSection } from "@/components/layout/dashboard/dashboard-sections/statistic"
import { DevelopmentSection } from "@/components/layout/dashboard/dashboard-sections/development"
import { HealthSection } from "@/components/layout/dashboard/dashboard-sections/health"
import { ScheduleSection } from "@/components/layout/dashboard/dashboard-sections/schedule"
import { DashboardSidebar } from "@/components/layout/dashboard/dashboard-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// Mock data cho bé hiện tại
const currentBaby = {
  id: 1,
  name: "Bé Minh",
  birthDate: "2024-04-15",
  age: "8 tháng 15 ngày",
  avatar: "/placeholder.svg?height=32&width=32",
  gender: "boy",
  weight: "8.2 kg",
  height: "69 cm",
  nextAppointment: "25/12/2024",
  recentPhotos: 24,
  milestones: 3,
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("overview")

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />
      case "statistics":
        return <StatisticsSection />
      case "development":
        return <DevelopmentSection />
      case "health":
        return <HealthSection />
      case "schedule":
        return <ScheduleSection />
      default:
        return <OverviewSection />
    }
  }

  return (
    <>
      <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 shadow-sm">
          <SidebarTrigger className="-ml-1" />

          {/* Baby Info Header */}
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentBaby.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {currentBaby.name.split(" ")[1]?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-semibold text-gray-900">{currentBaby.name}</h1>
                <p className="text-xs text-gray-500">{currentBaby.age}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-6 ml-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Cân nặng:</span>
                <span className="font-medium">{currentBaby.weight}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Chiều cao:</span>
                <span className="font-medium">{currentBaby.height}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-3 w-3 text-orange-500" />
                <span className="text-gray-600">Khám tiếp:</span>
                <span className="font-medium">{currentBaby.nextAppointment}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Camera className="h-4 w-4 mr-1" />
              <span className="hidden lg:inline">Thêm ảnh</span>
            </Button>
            <Badge className="hidden sm:flex">
              {currentBaby.recentPhotos} ảnh mới
            </Badge>
          </div>
        </header>

        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-gray-50">
          {/* Breadcrumb for current baby */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Baby className="h-4 w-4" />
            <span>Dashboard</span>
            <span>/</span>
            <span className="font-medium text-gray-900">{currentBaby.name}</span>
            <span>/</span>
            <span className="capitalize">
              {activeSection === "overview"
                ? "Tổng quan"
                : activeSection === "statistics"
                  ? "Thống kê"
                  : activeSection === "development"
                    ? "Phát triển"
                    : activeSection === "health"
                      ? "Sức khỏe"
                      : activeSection === "schedule"
                        ? "Lịch học"
                        : ""}
            </span>
          </div>

          {renderActiveSection()}
        </main>
      </SidebarInset>
    </>
  )
}