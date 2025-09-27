import axiosClient from "./axiosClient";

export const userApi = {
  getAll: () => axiosClient.get("/user"),
  getById: (id: string) => axiosClient.get(`/user/${id}`),
  create: (data: any) => axiosClient.post("/user", data),
};
