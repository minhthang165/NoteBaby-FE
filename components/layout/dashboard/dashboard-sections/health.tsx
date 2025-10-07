"use client"

export enum RecordType {
  ILLNESS = 'illness',
  VACCINATION = 'vaccination',
}

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { healthStatusAPI } from '@/lib/api/healthStatusAPI';
import { medicalRecordsAPI } from '@/lib/api/medicalRecordAPI';
import {
  Calendar, Weight, Ruler
} from "lucide-react";

// --- Định nghĩa các kiểu dữ liệu ---
interface HealthStatus {
  _id: string;
  height: number;
  weight: number;
  checkedAt: string;
  created_at: string;
}

interface MedicalRecord {
  _id: string;
  recordType: 'vaccination' | 'illness';
  name: string;
  recordDate: string;
  location?: string;
  notes?: string;
}

function HealthStatusForm({ babyId, onSuccess }: Readonly<{ babyId: string, onSuccess: () => void }>) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    checkedAt: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const checkedAtOptions = [
    { value: 'tại nhà', label: 'Tại nhà' },
    { value: 'bệnh viện', label: 'Bệnh viện' },
    { value: 'phòng khám', label: 'Phòng khám' },
    { value: 'khác', label: 'Khác' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.weight || !formData.height || !formData.checkedAt) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    const dataToSubmit = new FormData();
    dataToSubmit.append('childId', babyId);
    dataToSubmit.append('weight', formData.weight);
    dataToSubmit.append('height', formData.height);
    dataToSubmit.append('checkedAt', formData.checkedAt);
    if (formData.description) {
      dataToSubmit.append('description', formData.description);
    }

    try {
      const res = await healthStatusAPI.create(dataToSubmit);
      setFormData({ weight: '', height: '', checkedAt: '', description: '' });
      // Log activity to recent activities
      if (res && res.data) {
        if (typeof window !== 'undefined' && (window as any).addActivityFromHealthStatus) {
          (window as any).addActivityFromHealthStatus(res.data);
        }
      }
      if (onSuccess) onSuccess();
      toast({
        title: "Thành công",
        description: "Đã thêm chỉ số mới",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Thất bại",
        description: "Không thể thêm chỉ số. Vui lòng thử lại",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="weight" className="text-sm font-medium">Cân nặng (kg) *</label>
        <Input
          id="weight"
          type="number"
          step="0.1"
          required
          placeholder="Nhập cân nặng"
          value={formData.weight}
          onChange={e => setFormData({ ...formData, weight: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="height" className="text-sm font-medium">Chiều cao (cm) *</label>
        <Input
          id="height"
          type="number"
          step="0.1"
          required
          placeholder="Nhập chiều cao"
          value={formData.height}
          onChange={e => setFormData({ ...formData, height: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="checkedAt" className="text-sm font-medium">Nơi kiểm tra *</label>
        <select
          id="checkedAt"
          className="w-full p-2 border rounded-md mt-1"
          required
          value={formData.checkedAt}
          onChange={e => setFormData({ ...formData, checkedAt: e.target.value })}
        >
          <option value="">Chọn nơi kiểm tra</option>
          {checkedAtOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="description" className="text-sm font-medium">Ghi chú</label>
        <Input
          id="description"
          type="text"
          placeholder="Nhập ghi chú (nếu có)"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Đang lưu...' : 'Thêm chỉ số'}
      </Button>
    </form>
  );
}

function AppointmentForm({ babyId, onSuccess }: Readonly<{ babyId: string, onSuccess: () => void }>) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    recordType: RecordType.VACCINATION,
    name: '',
    recordDate: '',
    location: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await medicalRecordsAPI.create({
        childId: babyId,
        ...formData,
      });
      setFormData({ recordType: formData.recordType, name: '', recordDate: '', location: '', notes: '' });
      // Log activity to recent activities
      if (res && res.data) {
        if (typeof window !== 'undefined' && (window as any).addActivityFromMedicalRecord) {
          (window as any).addActivityFromMedicalRecord(res.data);
        }
      }
      if (onSuccess) onSuccess();
      toast({
        title: "Thành công",
        description: "Thêm lịch hẹn thành công!",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Thất bại",
        description: "Thêm lịch hẹn thất bại!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="text-sm font-medium">Tên lịch hẹn *</label>
        <Input id="name" required placeholder="Tiêm vắc-xin 6 trong 1" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
      </div>
      <div>
        <label htmlFor="recordDate" className="text-sm font-medium">Ngày giờ *</label>
        <Input id="recordDate" type="datetime-local" required value={formData.recordDate} onChange={e => setFormData({ ...formData, recordDate: e.target.value })} />
      </div>
      <div>
        <label htmlFor="location" className="text-sm font-medium">Địa điểm</label>
        <Input id="location" placeholder="Bệnh viện Vinmec Đà Nẵng" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
      </div>
      <div>
        <label htmlFor="notes" className="text-sm font-medium">Ghi chú</label>
        <Textarea id="notes" placeholder="Bé không bị sốt sau khi tiêm." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
      </div>
      <div>
        <label htmlFor="recordType" className="text-sm font-medium">Loại lịch hẹn *</label>
        <select
          id="recordType"
          className="w-full p-2 border rounded-md mt-1"
          value={formData.recordType}
          onChange={e => setFormData({ ...formData, recordType: e.target.value as RecordType })}
          required
        >
          <option value={RecordType.VACCINATION}>Tiêm chủng</option>
          <option value={RecordType.ILLNESS}>Khám bệnh</option>
        </select>
      </div>
      <div className="flex gap-4 pt-2">
        <Button type="submit" className="flex-1" disabled={loading}>{loading ? 'Đang lưu...' : 'Thêm lịch hẹn'}</Button>
      </div>
    </form>
  );
}


export function HealthSection({ babyId }: Readonly<{ babyId: string }>) {
  // Pagination for medical records
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [recordPage, setRecordPage] = useState(1);
  const recordPageSize = 6;
  const recordTotalPages = Math.ceil(medicalRecords.length / recordPageSize);
  const paginatedMedicalRecords = medicalRecords.slice((recordPage - 1) * recordPageSize, recordPage * recordPageSize);
  // Pagination state for growth history
  const [page, setPage] = useState(1);
  const [healthStatusList, setHealthStatusList] = useState<HealthStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Phân trang cho lịch sử tăng trưởng (sau khi healthStatusList đã được khai báo)
  const pageSize = 5;
  const totalPages = Math.ceil(healthStatusList.length / pageSize);
  const paginatedHealthStatus = healthStatusList.slice((page - 1) * pageSize, page * pageSize);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [healthRes, medicalRes] = await Promise.all([
        healthStatusAPI.getAll({ childId: babyId, sortOrder: 'desc', sortBy: 'created_at' }),
        medicalRecordsAPI.getAll({ childId: babyId, sortOrder: 'desc', sortBy: 'recordDate' })
      ]);
      console.log('HealthStatusList:', healthRes?.data);
      console.log('MedicalRecords:', medicalRes?.data);
      setHealthStatusList(healthRes?.data || []);
      setMedicalRecords(medicalRes?.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setHealthStatusList([]);
      setMedicalRecords([]);
    } finally { 
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (babyId) {
      fetchData();
    }
  }, [babyId]);

  const latestStatus = healthStatusList.length > 0 ? healthStatusList[0] : null;
  const latestAppointment = medicalRecords.length > 0 ? medicalRecords[0] : null;

  if (isLoading) {
      return <div>Đang tải dữ liệu sức khỏe...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Theo dõi sức khỏe</h1>
        {/* <Button><Plus className="h-4 w-4 mr-2" />Thêm hồ sơ</Button> */}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="records">Hồ sơ khám</TabsTrigger>
          <TabsTrigger value="growth">Tăng trưởng</TabsTrigger>
          <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {latestStatus ? (
            <Card className="shadow-md border rounded-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 rounded-t-xl">
                <CardTitle className="text-lg font-bold text-blue-700">Tổng quan sức khỏe gần nhất</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Cập nhật vào: {new Date(latestStatus.created_at).toLocaleString('vi-VN')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {/* Cân nặng */}
                  <div className="flex items-center gap-4 p-4 bg-blue-100 rounded-lg shadow-sm">
                    <Weight className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Cân nặng</p>
                      <p className="text-2xl font-bold text-blue-800">{latestStatus.weight} kg</p>
                    </div>
                  </div>
                  {/* Chiều cao */}
                  <div className="flex items-center gap-4 p-4 bg-green-100 rounded-lg shadow-sm">
                    <Ruler className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Chiều cao</p>
                      <p className="text-2xl font-bold text-green-800">{latestStatus.height} cm</p>
                    </div>
                  </div>
                </div>
                {/* Ghi chú / Mô tả */}
                {/* Không có trường ghi chú/mô tả trong dữ liệu trả về từ API */}
              </CardContent>
            </Card>
          ) : (
            <p className="text-center text-gray-500">Chưa có dữ liệu tổng quan.</p>
          )}

          {/* Hiển thị lịch hẹn gần nhất */}
          {latestAppointment && (
            <Card className="shadow-md border rounded-xl mt-6">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 rounded-t-xl">
                <CardTitle className="text-lg font-bold text-blue-700">Lịch hẹn sắp tới</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  {latestAppointment.recordType === 'vaccination' ? 
                    <Calendar className="h-5 w-5 text-blue-500" /> : 
                    <Ruler className="h-5 w-5 text-green-500" />
                  }
                  <p className="text-sm text-gray-500">
                    {latestAppointment.recordType === 'vaccination' ? 'Tiêm chủng' : 'Khám bệnh'}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium text-gray-600">Tên lịch hẹn:</p>
                  <p className="text-blue-700 font-semibold">{latestAppointment.name}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Thời gian:</p>
                  <p className="text-blue-700">{new Date(latestAppointment.recordDate).toLocaleString('vi-VN')}</p>
                </div>
                {latestAppointment.location && (
                  <div>
                    <p className="font-medium text-gray-600">Địa điểm:</p>
                    <p className="text-green-700">{latestAppointment.location}</p>
                  </div>
                )}
                {latestAppointment.notes && (
                  <div>
                    <p className="font-medium text-gray-600">Ghi chú:</p>
                    <p className="bg-gray-100 p-2 rounded-md text-gray-700 border-l-4 border-blue-400">{latestAppointment.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ======================================================================= */}
        {/* TAB HỒ SƠ KHÁM (GIỮ NGUYÊN) */}
        {/* ======================================================================= */}
        <TabsContent value="records" className="space-y-6">
          {medicalRecords.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedMedicalRecords.map(record => (
                  <Card key={record._id} className="border shadow-md rounded-xl hover:shadow-lg transition-all">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 rounded-t-xl">
                      <CardTitle className="flex items-center gap-2 text-blue-700">
                        {record.recordType === 'vaccination' ? <Calendar className="h-5 w-5 text-blue-500" /> : <Ruler className="h-5 w-5 text-green-500" />}
                        {record.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {record.recordType === 'vaccination' ? 'Tiêm chủng' : 'Khám bệnh'}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-gray-600 font-medium">Ngày:</span>
                        <span className="text-blue-700 font-semibold">{new Date(record.recordDate).toLocaleString('vi-VN')}</span>
                      </div>
                      {record.location && (
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-gray-600 font-medium">Địa điểm:</span>
                          <span className="text-green-700 font-semibold">{record.location}</span>
                        </div>
                      )}
                      {record.notes && (
                        <div className="mb-2">
                          <span className="text-gray-600 font-medium">Ghi chú:</span>
                          <p className="bg-gray-100 p-2 rounded-md mt-1 text-gray-700 border-l-4 border-blue-400">{record.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Pagination controls for medical records */}
              {recordTotalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => setRecordPage(recordPage - 1)} disabled={recordPage === 1}>
                    Trước
                  </Button>
                  <span className="text-sm">Trang {recordPage} / {recordTotalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setRecordPage(recordPage + 1)} disabled={recordPage === recordTotalPages}>
                    Sau
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500">Chưa có hồ sơ khám bệnh/tiêm chủng nào.</p>
          )}
        </TabsContent>
        
        {/* ======================================================================= */}
        {/* TAB TĂNG TRƯỞNG (ĐÃ SỬA LẠI) */}
        {/* ======================================================================= */}
        <TabsContent value="growth" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Thêm chỉ số mới</CardTitle></CardHeader>
            <CardContent>
              <HealthStatusForm babyId={babyId} onSuccess={fetchData} />
            </CardContent>
          </Card>
          <Card className="shadow-md border rounded-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 rounded-t-xl">
              <CardTitle className="text-lg font-bold text-blue-700">Lịch sử tăng trưởng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full border rounded-lg">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b text-left">Ngày ghi nhận</th>
                      <th className="py-2 px-4 border-b text-center">Cân nặng (kg)</th>
                      <th className="py-2 px-4 border-b text-center">Chiều cao (cm)</th>
                      <th className="py-2 px-4 border-b text-center">Nơi kiểm tra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedHealthStatus.length > 0 ? (
                      paginatedHealthStatus.map((status) => (
                        <tr key={status._id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4 border-b">{new Date(status.created_at).toLocaleDateString('vi-VN')}</td>
                          <td className="py-2 px-4 border-b text-center font-semibold text-blue-800">{status.weight}</td>
                          <td className="py-2 px-4 border-b text-center font-semibold text-green-800">{status.height}</td>
                          <td className="py-2 px-4 border-b text-center text-gray-600">{status.checkedAt}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center text-gray-500">Chưa có dữ liệu tăng trưởng.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Trước
                  </Button>
                  <span className="text-sm">Trang {page} / {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                    Sau
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Thêm lịch hẹn mới</CardTitle></CardHeader>
            <CardContent>
              <AppointmentForm babyId={babyId} onSuccess={fetchData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}