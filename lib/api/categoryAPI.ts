import axiosClient from "./axiosClient";

export const categoryAPI = {
  getAll: () => axiosClient.get("/category"),
  getById: (id: string) => axiosClient.get(`/category/id/${id}`),
  getByTitle: (title: string) => axiosClient.get(`/category/title/${title}`),
  create: (data: any) => axiosClient.post("/category", data),
  update: (id: string, data: any) => axiosClient.patch(`/category/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/category/${id}`),
};
