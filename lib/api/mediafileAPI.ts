import axiosClient from "./axiosClient";

export const mediafileAPI = {
  getAll: () => axiosClient.get("/Mediafiles"),
  getById: (id: string) => axiosClient.get(`/Mediafiles/${id}`),
  create: (data: any) => axiosClient.post("/Mediafiles", data),
  update: (id: string, data: any) => axiosClient.put(`/Mediafiles/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/Mediafiles/${id}`),
  getByFileType: (fileType: string) => axiosClient.get(`/Mediafiles/filetype/${fileType}`),
  getByName: (name: string) => axiosClient.get(`/Mediafiles/fileName/${name}`),
};
