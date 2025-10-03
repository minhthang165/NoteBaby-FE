import axiosClient from "./axiosClient";

export const forumpostAPI = {
  getAll: () => axiosClient.get("/Forumpost"),
  getById: (id: string) => axiosClient.get(`/Forumpost/${id}`),
  getByTitle: (title: string) => axiosClient.get(`/Forumpost/title/${title}`),
  getByAuthor: (author: string) => axiosClient.get(`/Forumpost/author/${author}`),
  create: (data: any) => axiosClient.post("/Forumpost", data),
  update: (id: string, data: any) => axiosClient.put(`/Forumpost/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/Forumpost/${id}`),
};
