import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. https://localhost:7188/api
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: auto logout if token expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized. Logging out...");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
