import { create } from "zustand";
import { api, apiUpload } from "../utils/api";

export const useVideoStore = create((set) => ({
  videos: [],
  myVideos: [],
  loading: false,

  fetchVideos: async () => {
    set({ loading: true });
    try {
      const { videos } = await api("/videos");
      set({ videos });
    } finally {
      set({ loading: false });
    }
  },

  fetchMine: async () => {
    set({ loading: true });
    try {
      const { videos } = await api("/videos/mine");
      set({ myVideos: videos });
    } finally {
      set({ loading: false });
    }
  },

  addVideo: async (formData, onProgress) => {
    const { video } = await apiUpload("/videos", formData, onProgress);
    set((s) => ({
      videos: [video, ...s.videos],
      myVideos: [video, ...s.myVideos],
    }));
    return video;
  },

  deleteVideo: async (id) => {
    await api(`/videos/${id}`, { method: "DELETE" });
    set((s) => ({
      videos: s.videos.filter((v) => v.id !== id),
      myVideos: s.myVideos.filter((v) => v.id !== id),
    }));
  },

  clear: () => set({ videos: [], myVideos: [] }),
}));
