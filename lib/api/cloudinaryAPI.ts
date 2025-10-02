import axiosClient from "./axiosClient";

export const cloudinaryAPI = {
  getImages: () => axiosClient.get("/cloudinary/images"),
  getVideos: () => axiosClient.get("/cloudinary/videos"),
  getFiles: () => axiosClient.get("/cloudinary/files"),
  upload: (data: any) => axiosClient.post("/cloudinary/upload", data),
};
