import api from "./axios";

export const fetchStats = () => api.get("/dashboard/stats").then((res) => res.data);
export const fetchTimeline = () => api.get("/dashboard/timeline").then((res) => res.data);
export const fetchTopSources = () => api.get("/dashboard/top-sources").then((res) => res.data);
export const fetchSeverity = () => api.get("/dashboard/severity").then((res) => res.data);
export const fetchAssets = () => api.get("/dashboard/assets").then((res) => res.data);