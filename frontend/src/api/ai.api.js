import api from "./axios";

export const runAnalysis = (payload) => api.post("/ai/analyze", payload).then((res) => res.data);
export const getAnalysisHistory = () => api.get("/ai/history").then((res) => res.data);
export const getAnalysis = (id) => api.get(`/ai/analyses/${id}`).then((res) => res.data);