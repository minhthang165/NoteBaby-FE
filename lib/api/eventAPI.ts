// trong file: lib/api/eventsAPI.ts

import axiosClient from './axiosClient';

// Định nghĩa kiểu dữ liệu cho Event
interface Event {
  _id: string;
  title: string;
  startAt: string;
  endAt: string;
  eventType: 'school' | 'extraClass' | 'sport' | 'other';
  notes?: string;
  childId: any;
  createdBy: any;
}

// Kiểu cho các tham số phân trang và lọc
interface GetAllEventsParams {
  childId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const eventsAPI = {
  /**
   * Lấy tất cả sự kiện (có thể lọc theo bé và phân trang)
   */
  getAll: (params?: GetAllEventsParams): Promise<{ data: Event[], total: number }> => {
    return axiosClient.get('/events', { params }).then(res => res.data.data);
  },

  /**
   * Lấy một sự kiện bằng ID của chính nó
   */
  getById: (id: string): Promise<Event> => {
    return axiosClient.get(`/events/${id}`).then(res => res.data.data);
  },

  /**
   * Tạo một sự kiện mới
   */
  create: (data: Partial<Event>): Promise<Event> => {
    // Dữ liệu `createdBy` sẽ được backend xử lý
    return axiosClient.post('/events', data).then(res => res.data.data);
  },

  /**
   * Cập nhật một sự kiện
   */
  update: (id: string, data: Partial<Event>): Promise<Event> => {
    return axiosClient.patch(`/events/${id}`, data).then(res => res.data.data);
  },

  /**
   * Xóa một sự kiện
   */
  remove: (id: string): Promise<Event> => {
    // Service của bạn dùng `delete`, nên ta gọi đến hàm remove trong controller
    return axiosClient.delete(`/events/${id}`).then(res => res.data.data);
  },
};