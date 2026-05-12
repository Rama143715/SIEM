import { create } from "zustand";
import { fetchLogs } from "../api/logs.api";

const useLogsStore = create((set, get) => ({
  logs: [],
  total: 0,
  filters: {
    severity: [],
    source: "",
    search: "",
    from: "",
    to: "",
    page: 1,
    limit: 100,
  },
  selectedIds: [],
  isStreaming: true,

  addLiveLogs: (newLogs) => {
    set((state) => ({
      logs: [...newLogs, ...state.logs].slice(0, 2000),
      total: state.total + newLogs.length,
    }));
  },

  fetchLogs: async (params = {}) => {
    const merged = { ...get().filters, ...params };
    const payload = {
      ...merged,
      severity: merged.severity?.join(",") || undefined,
    };

    const data = await fetchLogs(payload);
    set({ logs: data.logs || [], total: data.total || 0, filters: merged });
  },

  toggleSelected: (id) => {
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((item) => item !== id)
        : [...state.selectedIds, id],
    }));
  },

  setFilter: (key, value) => {
    set((state) => ({ filters: { ...state.filters, [key]: value } }));
  },

  toggleStreaming: () => {
    set((state) => ({ isStreaming: !state.isStreaming }));
  },
}));

export default useLogsStore;