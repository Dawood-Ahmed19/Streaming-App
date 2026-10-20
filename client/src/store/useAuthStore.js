import { create } from "zustand";
import { api, setToken, clearToken, getToken } from "../utils/api";

export const useAuthStore = create((set) => ({
  currentUser: null,
  initializing: !!getToken(),

  loadSession: async () => {
    if (!getToken()) return set({ initializing: false });
    try {
      const { user } = await api("/auth/me");
      set({ currentUser: user, initializing: false });
    } catch (err) {
      if (err.status === 401) clearToken();
      set({ currentUser: null, initializing: false });
    }
  },

  signup: async (form) => {
    const { user, token } = await api("/auth/signup", {
      method: "POST",
      body: form,
    });
    setToken(token);
    set({ currentUser: user });
  },

  signin: async (form) => {
    const { user, token } = await api("/auth/signin", {
      method: "POST",
      body: form,
    });
    setToken(token);
    set({ currentUser: user });
  },

  signout: () => {
    clearToken();
    set({ currentUser: null });
  },

  updateProfile: async (form) => {
    const { user } = await api("/auth/profile", { method: "PUT", body: form });
    set({ currentUser: user });
    return user;
  },

  deleteAccount: async () => {
    await api("/auth/account", { method: "DELETE" });
    clearToken();
    set({ currentUser: null });
  },
}));
