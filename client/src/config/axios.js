import axios from "axios";

const rawBaseUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
export const BACKEND_URL = rawBaseUrl.replace(/\/+$/, "");

const apiClient = axios.create({
  baseURL: BACKEND_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
