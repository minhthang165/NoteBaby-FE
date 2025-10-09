"use client"

import { useEffect, useState } from "react"
import { getDataFromJWT } from "@/lib/utils"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Baby, Badge, Calendar, Camera, Home } from "lucide-react"
import { OverviewSection } from "@/components/layout/dashboard/dashboard-sections/overview"
import { StatisticsSection } from "@/components/layout/dashboard/dashboard-sections/statistic"
import { DevelopmentSection } from "@/components/layout/dashboard/dashboard-sections/development"
import { HealthSection } from "@/components/layout/dashboard/dashboard-sections/health"
import { ScheduleSection } from "@/components/layout/dashboard/dashboard-sections/schedule"
import { DashboardSidebar } from "@/components/layout/dashboard/dashboard-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { babiesAPI } from "@/lib/api/babiesApi" 


export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("overview")
  const [babies, setBabies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBabyId, setSelectedBabyId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBabies() {
      try {
        const currentUser = getDataFromJWT() as { id?: string; sub?: string } | null;
        const userId = currentUser?.id || currentUser?.sub;
        
        if (!userId) {
          window.location.href = '/sign-in';
          return;
        }

        const res = await babiesAPI.getAll({ parentId: userId })
        setBabies(res.babies || [])
        // Nếu chưa chọn em bé, chọn em bé đầu tiên
        if (res.babies && res.babies.length > 0) {
          // fallback cho id hoặc _id
          setSelectedBabyId(String(res.babies[0].id || res.babies[0]._id))
        }
      } catch (err) {
        console.error('Error fetching babies:', err);
        setBabies([])
      } finally {
        setLoading(false)
      }
    }
    fetchBabies()
  }, [])

  // Tìm em bé hiện tại theo selectedBabyId
  const currentBaby = babies.find(b => (b.id || b._id) === selectedBabyId)

  // Hàm đổi em bé
  const handleChangeBaby = (id: string) => {
    setSelectedBabyId(id)
  }

  const renderActiveSection = () => {
    if (!currentBaby) return null
    switch (activeSection) {
      case "overview":
        return <OverviewSection baby={currentBaby} />
      case "statistics":
        return <StatisticsSection baby={currentBaby} />
      case "development":
        return <DevelopmentSection baby={currentBaby} />
      case "health":
        return <HealthSection babyId={currentBaby.id} />
      case "schedule":
        return <ScheduleSection />
      default:
        return <OverviewSection baby={currentBaby} />
    }
  }

  if (loading) return <div>Đang tải dữ liệu...</div>
  
  // Nếu không có baby nào, hiển thị giao diện để thêm baby mới
  if (!currentBaby) {
    return (
      <>
        <DashboardSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          babies={babies}
          selectedBabyId={selectedBabyId}
          setSelectedBabyId={setSelectedBabyId}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 shadow-sm">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-4 flex-1">
              <h1 className="text-lg font-semibold">Chào mừng đến với NotBy!</h1>
            </div>
            <Link href="/" passHref>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Home className="h-4 w-4 mr-1" />
                <span className="hidden lg:inline">Trang chủ</span>
              </Button>
            </Link>
          </header>
          <main className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-gray-50">
            <div className="text-center py-8">
              <Baby className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h2 className="text-xl font-semibold mb-2">Bắt đầu theo dõi bé của bạn</h2>
              <p className="text-gray-600 mb-4">Hãy thêm thông tin của bé để bắt đầu hành trình ghi lại những khoảnh khắc đáng nhớ</p>
            </div>
          </main>
        </SidebarInset>
      </>
    )
  }

  const fullName = `${currentBaby.lastName} ${currentBaby.firstName}`

  const dob = new Date(currentBaby.dob)
  const now = new Date()
  const ageMonths = now.getMonth() - dob.getMonth() + (12 * (now.getFullYear() - dob.getFullYear()))
  const ageDays = now.getDate() - dob.getDate()
  const age = `${ageMonths} tháng ${ageDays >= 0 ? ageDays : 0} ngày`

  return (
    <>
      {/* Sidebar sẽ xử lý chọn bé */}
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        babies={babies}
        selectedBabyId={selectedBabyId}
        setSelectedBabyId={setSelectedBabyId}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 shadow-sm">
          <SidebarTrigger className="-ml-1" />

          {/* Baby Info Header */}
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={"/placeholder.svg"} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {currentBaby.firstName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-semibold text-gray-900">{fullName}</h1>
                <p className="text-xs text-gray-500">{age}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-6 ml-6">
              {/* Nếu có dữ liệu cân nặng, chiều cao thì hiển thị */}
              {/* <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Cân nặng:</span>
                <span className="font-medium">{currentBaby.weight}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Chiều cao:</span>
                <span className="-medium">{currentBaby.height}</span>
              </div> */}
              {/* Dữ liệu khám tiếp và ảnh mới cần lấy từ API nếu có */}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-3 w-3 text-orange-500" />
                <span className="text-gray-600">Khám tiếp:</span>
                <span className="font-medium">--</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Link href="/" passHref>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Home className="h-4 w-4 mr-1" />
                <span className="hidden lg:inline">Trang chủ</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Camera className="h-4 w-4 mr-1" />
              <span className="hidden lg:inline">Thêm ảnh</span>
            </Button>
            <Badge className="hidden sm:flex">
              {/* Nếu có dữ liệu ảnh mới thì hiển thị */}
              0 ảnh mới
            </Badge>
          </div>
        </header>

        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-gray-50">
          {/* Breadcrumb for current baby */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Baby className="h-4 w-4" />
            <span>Dashboard</span>
            <span>/</span>
            <span className="font-medium text-gray-900">{fullName}</span>
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