"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Camera,
  BookOpen,
  Heart,
  Calendar,
  Dumbbell,
  MessageCircle,
  Apple,
  Users,
  MoreHorizontal,
  GraduationCap,
  BookOpenCheck,
  Trophy
} from "lucide-react"

// Import API services
import { diaryEntriesAPI } from "@/lib/api/diaryEntriesAPI"
import { medicalRecordsAPI } from "@/lib/api/medicalRecordAPI"
import { healthStatusAPI } from "@/lib/api/healthStatusAPI"

type MonthlyStat = {
  month: string;
  photos: number;
  notes: number;
  health: number;
};

type GrowthData = {
  create_at: string;
  height: number;
  weight: number;
  headCircumference: number;
};

type MonthlyGrowthData = {
  [key: string]: GrowthData[];
};

type StatsData = {
  totalPhotos: number;
  totalDiaryEntries: number;
  totalMedicalRecords: number;
  monthlyStats: MonthlyStat[];
  growthData: MonthlyGrowthData;
};

export function StatisticsSection({ baby }: Readonly<{ baby: any }>) {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>({
    totalPhotos: 0,
    totalDiaryEntries: 0,
    totalMedicalRecords: 0,
    monthlyStats: [],
    growthData: {},
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!baby?._id) return;
      setIsLoading(true);
      setError(null);
      try {
        console.log('Fetching stats for baby:', baby._id);
        // Gọi song song các API để lấy dữ liệu
        const [diaryRes, medicalRes, healthRes] = await Promise.all([
          diaryEntriesAPI.getAll({ childId: baby._id, limit: 1000 }), // Lấy tất cả để thống kê
          medicalRecordsAPI.getAll({ childId: baby._id, limit: 1000 }),
          healthStatusAPI.getAll({ childId: baby._id }),
        ]);

        console.log('API responses:', { diary: diaryRes?.data, medical: medicalRes?.data });
        
        const diaryEntries = diaryRes.data?.data?.data || [];
        const medicalRecords = medicalRes.data || [];
        const healthData = healthRes.data || [];

        // Xử lý dữ liệu tăng trưởng
        const processGrowthData = (data: any[]) => {
          // Nhóm dữ liệu theo tháng
          const monthlyGroups = data.reduce((groups: { [key: string]: any[] }, record) => {
            const date = new Date(record.created_at);
            const monthKey = `Tháng ${date.getMonth() + 1}`; // Định dạng: "Tháng 10"
            if (!groups[monthKey]) {
              groups[monthKey] = [];
            }
            groups[monthKey].push({
              create_at: record.created_at,
              height: record.height || 0,
              weight: record.weight || 0,
              headCircumference: record.headCircumference || 0,
            });
            return groups;
          }, {});

          // Sắp xếp trong mỗi tháng và lấy 3 bản ghi mới nhất
          Object.keys(monthlyGroups).forEach(month => {
            monthlyGroups[month].sort((a: any, b: any) => 
              new Date(b.create_at).getTime() - new Date(a.create_at).getTime()
            );
            monthlyGroups[month] = monthlyGroups[month].slice(0, 3);
          });

          return monthlyGroups;
        };

        const growthData = processGrowthData(healthData);

        // --- Bắt đầu tính toán ---
        const totalPhotos = diaryEntries.reduce((sum: number, entry: any) => sum + (entry.imageUrls?.length || 0), 0);

        const monthlyData = new Map<string, MonthlyStat>();
        const now = new Date();
        for (let i = 5; i >= 0; i--) { 
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = `${month.getFullYear()}-${month.getMonth() + 1}`;
          monthlyData.set(monthKey, { month: `T${month.getMonth() + 1}`, photos: 0, notes: 0, health: 0 });
        }
        
        diaryEntries.forEach((entry: any) => {
          const date = new Date(entry.created_at || '');
          const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          if (monthlyData.has(monthKey)) {
            const monthStat = monthlyData.get(monthKey)!;
            monthStat.photos += entry.imageUrls?.length || 0;
            monthStat.notes += 1;
          }
        });

        medicalRecords.forEach((record: any) => {
          const date = new Date(record.recordDate || '');
          const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          if (monthlyData.has(monthKey)) {
            monthlyData.get(monthKey)!.health += 1;
          }
        });

        setStats({
          totalPhotos,
          totalDiaryEntries: diaryEntries.length,
          totalMedicalRecords: medicalRecords.length,
          monthlyStats: Array.from(monthlyData.values()).reverse(),
          growthData,
        });
        
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [baby?._id]);

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0 && current > 0) return 100;
    if (previous === 0 && current === 0) return 0;
    return ((current - previous) / previous) * 100;
  };
  
  if (!baby?._id) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-gray-500">Vui lòng chọn bé để xem thống kê</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-96 bg-gray-200 rounded mt-2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Thống kê phát triển</h1>
        <p className="text-gray-600 mt-2">Theo dõi sự phát triển của bé qua các chỉ số</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="growth">Tăng trưởng</TabsTrigger>
          <TabsTrigger value="activities">Hoạt động</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Biểu đồ tăng trưởng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Bảng cân nặng và chiều cao */}
                <div className="grid grid-cols-2 gap-8">
                  {/* Cột cân nặng */}
                  <div className="bg-blue-50/40 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-6 text-blue-900">Cân nặng (kg)</h3>
                    <div className="space-y-4">
                      {Object.entries(stats.growthData)
                        .sort((a, b) => {
                          const monthA = parseInt(a[0].split(' ')[1]);
                          const monthB = parseInt(b[0].split(' ')[1]);
                           return monthB - monthA;
                        })
                        .map(([month, data]) => (
                          <div key={month} className="flex justify-between items-center">
                            <div className="text-gray-600 text-sm">{month}</div>
                            <div className="text-blue-600 font-medium">{data[0]?.weight.toFixed(1)} kg</div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Cột chiều cao */}
                  <div className="bg-green-50/40 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-6 text-green-900">Chiều cao (cm)</h3>
                    <div className="space-y-4">
                      {Object.entries(stats.growthData)
                        .sort((a, b) => {
                          const monthA = parseInt(a[0].split(' ')[1]);
                          const monthB = parseInt(b[0].split(' ')[1]);
                          return monthB - monthA; 
                        })
                        .map(([month, data]) => (
                          <div key={month} className="flex justify-between items-center">
                            <div className="text-gray-600 text-sm">{month}</div>
                            <div className="text-green-600 font-medium">{data[0]?.height.toFixed(0)} cm</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                </div>
                
                
               
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card Tổng ảnh */}
            <Card className="w-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-500" />
                  <p className="text-sm font-medium">Tổng ảnh</p>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.totalPhotos}</p>
                <p className="text-xs text-green-600 mt-1">
                  {stats.monthlyStats.length >= 2 ?
                    `${getPercentageChange(stats.monthlyStats[5].photos, stats.monthlyStats[4].photos).toFixed(0)}% so với tháng trước`
                    : 'N/A'
                  }
                </p>
              </CardContent>
            </Card>
            {/* Card Ghi chú */}
            <Card className="w-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-500" />
                  <p className="text-sm font-medium">Ghi chú</p>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.totalDiaryEntries}</p>
                <p className="text-xs text-green-600 mt-1">
                  {stats.monthlyStats.length >= 2 ?
                    `${getPercentageChange(stats.monthlyStats[5].notes, stats.monthlyStats[4].notes).toFixed(0)}% so với tháng trước`
                    : 'N/A'
                  }
                </p>
              </CardContent>
            </Card>
            {/* Card Khám sức khỏe */}
            <Card className="w-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <p className="text-sm font-medium">Khám sức khỏe</p>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.totalMedicalRecords}</p>
                <p className="text-xs text-green-600 mt-1">
                  {stats.monthlyStats.length >= 2 ?
                    `${getPercentageChange(stats.monthlyStats[5].health, stats.monthlyStats[4].health).toFixed(0)}% so với tháng trước`
                    : 'N/A'
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Activity Chart */}
          <Card className="mb-6">
            <CardHeader><CardTitle>Hoạt động theo tháng</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.monthlyStats.map((stat) => (
                  <div key={stat.month} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium">{stat.month}</div>
                    <div className="flex-1 space-y-2">
                      {/* Ảnh */}
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-blue-500" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(stat.photos / Math.max(...stats.monthlyStats.map(s => s.photos))) * 100}%` }}
                          />
                        </div>
                        <div className="w-8 text-xs font-medium">{stat.photos}</div>
                      </div>
                      {/* Ghi chú */}
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-green-500" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(stat.notes / Math.max(...stats.monthlyStats.map(s => s.notes))) * 100}%` }}
                          />
                        </div>
                        <div className="w-8 text-xs font-medium">{stat.notes}</div>
                      </div>
                      {/* Sức khỏe */}
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${(stat.health / Math.max(...stats.monthlyStats.map(s => s.health))) * 100}%` }}
                          />
                        </div>
                        <div className="w-8 text-xs font-medium">{stat.health}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activities" className="space-y-6">
          {/* Category Statistics */}
          <div className="grid grid-cols-2 gap-6">
            {/* Nhật ký phát triển */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Phân loại nhật ký
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: 'Vận động', icon: <Dumbbell className="w-4 h-4" />, color: 'bg-blue-500', value: 35 },
                    { type: 'Ngôn ngữ', icon: <MessageCircle className="w-4 h-4" />, color: 'bg-green-500', value: 25 },
                    { type: 'Dinh dưỡng', icon: <Apple className="w-4 h-4" />, color: 'bg-yellow-500', value: 20 },
                    { type: 'Xã hội', icon: <Users className="w-4 h-4" />, color: 'bg-purple-500', value: 15 },
                    { type: 'Khác', icon: <MoreHorizontal className="w-4 h-4" />, color: 'bg-gray-500', value: 5 }
                  ].map(({ type, icon, color, value }) => (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`text-${color.replace('bg-', '')}`}>{icon}</div>
                          <span className="text-sm font-medium">{type}</span>
                        </div>
                        <span className="text-sm text-gray-500">{value}%</span>
                      </div>
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full ${color} rounded-full transition-all`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sự kiện */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Phân loại sự kiện
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: 'Học tập', icon: <GraduationCap className="w-4 h-4" />, color: 'bg-blue-500', value: 40 },
                    { type: 'Lớp phụ đạo', icon: <BookOpenCheck className="w-4 h-4" />, color: 'bg-green-500', value: 30 },
                    { type: 'Thể thao', icon: <Trophy className="w-4 h-4" />, color: 'bg-yellow-500', value: 20 },
                    { type: 'Khác', icon: <MoreHorizontal className="w-4 h-4" />, color: 'bg-purple-500', value: 10 }
                  ].map(({ type, icon, color, value }) => (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`text-${color.replace('bg-', '')}`}>{icon}</div>
                          <span className="text-sm font-medium">{type}</span>
                        </div>
                        <span className="text-sm text-gray-500">{value}%</span>
                      </div>
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full ${color} rounded-full transition-all`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}