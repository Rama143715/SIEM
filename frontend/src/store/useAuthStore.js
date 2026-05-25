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

  updateProfile: async ({ email, full_name }) => {
    set({ loading: true });
    try {
      const { data } = await api.patch("/auth/profile", { email, full_name });
      set({ user: data.user || null, loading: false });
      return { ok: true };
    } catch (error) {
      set({ loading: false });
      return { ok: false, error: error.response?.data?.error || "Profile update failed." };
    }
  },

  changePassword: async ({ current_password, new_password }) => {
    set({ loading: true });
    try {
      const { data } = await api.patch("/auth/password", { current_password, new_password });
      set({ user: data.user || null, loading: false });
      return { ok: true };
    } catch (error) {
      set({ loading: false });
      return { ok: false, error: error.response?.data?.error || "Password change failed." };
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
