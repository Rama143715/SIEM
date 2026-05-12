import api from "./axios";

export const fetchLogs = (params) => api.get("/logs", { params }).then((res) => res.data);
export const ingestLogs = (payload) => api.post("/logs/ingest", payload).then((res) => res.data);
export const ingestSingleLog = (payload) => api.post("/logs/ingest/single", payload).then((res) => res.data);
export const getLog = (id) => api.get(`/logs/${id}`).then((res) => res.data);