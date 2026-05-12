import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshing) {
        const refreshToken = localStorage.getItem("refresh_token");

        refreshing = axios
          .post(`${baseURL}/auth/refresh`, { refresh_token: refreshToken })
          .then(({ data }) => {
            localStorage.setItem("access_token", data.access_token);
            return data.access_token;
          })
          .finally(() => {
            refreshing = null;
          });
      }

      const newToken = await refreshing;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default api;