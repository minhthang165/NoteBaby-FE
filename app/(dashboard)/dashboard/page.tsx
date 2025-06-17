"use client"

import { useState } from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Baby } from "lucide-react"
import { OverviewSection } from "@/components/layout/dashboard/dashboard-sections/overview"
import { StatisticsSection } from "@/components/layout/dashboard/dashboard-sections/statistic"
import { DevelopmentSection } from "@/components/layout/dashboard/dashboard-sections/development"
import { HealthSection } from "@/components/layout/dashboard/dashboard-sections/health"
import { ScheduleSection } from "@/components/layout/dashboard/dashboard-sections/schedule"
import { DashboardSidebar } from "@/components/layout/dashboard/dashboard-sidebar"

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
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-blue-500">
              <Baby className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">NoteBaby Dashboard</h1>
              <p className="text-xs text-gray-500">Quản lý kỷ niệm của bé</p>
            </div>
          </div>
        </header>
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-gray-50">{renderActiveSection()}</main>
      </SidebarInset>
    </>
  )
}
