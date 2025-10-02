import axiosClient from "./axiosClient";

export const articlesAPI = {
  getAll: () => axiosClient.get("/article"),
  getById: (id: string) => axiosClient.get(`/article/id/${id}`),
  getByTitle: (title: string) => axiosClient.get(`/article/title/${title}`),
  create: (data: any) => axiosClient.post("/article", data),
  update: (id: string, data: any) => axiosClient.put(`/article/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/article/${id}`),
};
