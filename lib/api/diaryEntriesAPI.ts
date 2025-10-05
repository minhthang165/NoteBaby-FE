import axiosClient from './axiosClient';

export const diaryEntriesAPI = {
  getAll: (params?: any) => axiosClient.get('/diary-entries', { params }),
  getById: (id: string) => axiosClient.get(`/diary-entries/${id}`),
  create: (formData: FormData) => axiosClient.post('/diary-entries', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: string, formData: FormData) => axiosClient.patch(`/diary-entries/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  remove: (id: string) => axiosClient.delete(`/diary-entries/${id}`),
};