import api from "./axios";

export const fetchAlerts = (params) => api.get("/alerts", { params }).then((res) => res.data);
export const updateAlert = (id, payload) => api.patch(`/alerts/${id}`, payload).then((res) => res.data);
export const ackAlert = (id) => api.post(`/alerts/${id}/acknowledge`).then((res) => res.data);
export const resolveAlert = (id) => api.post(`/alerts/${id}/resolve`).then((res) => res.data);
export const bulkAck = (ids) => api.post("/alerts/bulk-acknowledge", { ids }).then((res) => res.data);