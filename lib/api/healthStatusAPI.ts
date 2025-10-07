import axiosClient from './axiosClient';

// Định nghĩa kiểu dữ liệu cho HealthStatus dựa trên response API
interface HealthStatus {
  data: HealthStatus;
  _id: string;
  height: number;
  weight: number;
  checkedAt: string;
  description?: string;
  imageUrls?: string[];
  created_at: string;
  childId: any; 
}

// Kiểu cho các tham số phân trang và lọc
interface GetAllHealthStatusParams {
  childId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Kiểu dữ liệu trả về từ API getAll (có phân trang)
interface HealthStatusApiResponse {
  data: HealthStatus[];
  total: number;
  page: number;
  limit: number;
}

export const healthStatusAPI = {
  /**
   * Lấy tất cả bản ghi sức khỏe (có thể lọc theo bé và phân trang)
   */
  getAll: (params?: GetAllHealthStatusParams): Promise<HealthStatusApiResponse> => {
    return axiosClient.get('/health-status', { params }).then(res => res.data.data);
  },

  /**
   * Lấy một bản ghi sức khỏe bằng ID
   */
  getById: (id: string): Promise<HealthStatus> => {
    return axiosClient.get(`/health-status/${id}`).then(res => res.data.data);
  },

  /**
   * Tạo một bản ghi sức khỏe mới (có thể kèm ảnh)
   * @param formData - Đối tượng FormData chứa các trường dữ liệu và file
   */
  create: (formData: FormData): Promise<HealthStatus> => {
    return axiosClient.post('/health-status', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data.data);
  },

  /**
   * Cập nhật một bản ghi sức khỏe (có thể kèm ảnh mới)
   * @param id - ID của bản ghi cần cập nhật
   * @param formData - Đối tượng FormData chứa các trường dữ liệu và file
   */
  update: (id: string, formData: FormData): Promise<HealthStatus> => {
    return axiosClient.patch(`/health-status/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data.data);
  },

  /**
   * Xóa một bản ghi sức khỏe
   */
  remove: (id: string): Promise<HealthStatus> => {
    return axiosClient.delete(`/health-status/${id}`).then(res => res.data.data);
  },
};