import { create } from "zustand";
import { fetchAlerts } from "../api/alerts.api";

const useAlertsStore = create((set) => ({
  alerts: [],
  loading: false,

  setAlerts: (alerts) => set({ alerts }),

  addLiveAlert: (alert) => {
    set((state) => ({ alerts: [alert, ...state.alerts].slice(0, 1000) }));
  },

  fetchAlerts: async (params = {}) => {
    set({ loading: true });
    try {
      const data = await fetchAlerts(params);
      set({ alerts: data.alerts || [], loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));

export default useAlertsStore;