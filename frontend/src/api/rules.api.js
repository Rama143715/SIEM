import api from "./axios";

export const fetchRules = () => api.get("/rules").then((res) => res.data);
export const createRule = (payload) => api.post("/rules", payload).then((res) => res.data);
export const toggleRule = (id) => api.post(`/rules/${id}/toggle`).then((res) => res.data);
export const deleteRule = (id) => api.delete(`/rules/${id}`).then((res) => res.data);
export const testRule = (payload) => api.post("/rules/test", payload).then((res) => res.data);