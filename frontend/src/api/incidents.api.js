import api from "./axios";

export const fetchIncidents = () => api.get("/incidents").then((res) => res.data);
export const createIncident = (payload) => api.post("/incidents", payload).then((res) => res.data);
export const getIncident = (id) => api.get(`/incidents/${id}`).then((res) => res.data);
export const updateIncident = (id, payload) => api.patch(`/incidents/${id}`, payload).then((res) => res.data);
export const addTimeline = (id, payload) => api.post(`/incidents/${id}/timeline`, payload).then((res) => res.data);