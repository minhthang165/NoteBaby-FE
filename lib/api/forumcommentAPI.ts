import axiosClient from "./axiosClient";

export const forumcommentAPI = {
  getAll: () => axiosClient.get("/ForumComment"),
  getById: (id: string) => axiosClient.get(`/ForumComment/${id}`),
  getByPostId: (postId: string) => axiosClient.get(`/ForumComment/post/${postId}`),
  getByAuthor: (author: string) => axiosClient.get(`/ForumComment/author/${author}`),
  create: (data: any) => axiosClient.post("/ForumComment", data),
  update: (id: string, data: any) => axiosClient.patch(`/ForumComment/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/ForumComment/${id}`),
};
