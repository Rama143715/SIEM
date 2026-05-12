import { create } from "zustand";
import api from "../api/axios";

const useAuthStore = create((set) => ({
  user: null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      set({ user: data.user, loading: false });
      return { ok: true };
    } catch (error) {
      set({ loading: false });
      return { ok: false, error: error.response?.data?.error || "Login failed." };
    }
  },

  loadMe: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      set({ user: null });
      return;
    }

    try {
      const { data } = await api.get("/auth/me");
      set({ user: data.user || null });
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      set({ user: null });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore logout network failures
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ user: null });
  },
}));

export default useAuthStore;