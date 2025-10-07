import axiosClient from "./axiosClient";

export const userApi = {
  getAll: () => axiosClient.get("/user"),
  getById: (id: string) => axiosClient.get(`/user/id/${id}`),
  create: (data: any) => axiosClient.post("/user", data),
  update: (id: string, data: any) => axiosClient.patch(`/user/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/user/${id}`),
  getByEmail: (email: string) => axiosClient.get(`/user/email/${email}`),
  getByGoogleId: (googleId: string) => axiosClient.get(`/user/google-id/${googleId}`),
  getByRole: (role: string) => axiosClient.get(`/user/role/${role}`),
};
