// this is the entry point for the api client
import axios from "axios";

const clientAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/v1/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

//Request interceptor - add token to the request headers
clientAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

//Response interceptor - handle errors
clientAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    throw { status, message };
  },
);

export default clientAPI;
