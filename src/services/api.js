import axios from "axios";
import { isTokenExpired } from "../utils/jwt";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const PUBLIC_PAGES = [
  "/login",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
  "/leave-action",
];

// endpoints that must work without a session (change-password / register still need the token)
const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/forgot-password",
  "/auth/verify-otp",
  "/auth/reset-password",
  "/leave-action/",
];

const isPublicEndpoint = (url = "") =>
  PUBLIC_ENDPOINTS.some((p) => url.includes(p));

const clearSessionAndGoToLogin = () => {
  localStorage.clear();
  if (!PUBLIC_PAGES.includes(window.location.pathname)) {
    window.location.href = "/login";
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // login / forgot-password / email-action calls never need a token.
    // (A stale token sent with them used to make the login fail.)
    if (isPublicEndpoint(config.url)) {
      return config;
    }

    const token = localStorage.getItem("token");

    if (token) {
      if (isTokenExpired(token)) {
        // session ended: clean up and ask the user to login again
        clearSessionAndGoToLogin();
        return Promise.reject(new axios.Cancel("Session expired"));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // 401 on a protected call = token rejected/expired -> logout cleanly.
    // (401 on the login call itself is just "wrong password": keep the message.)
    if (status === 401 && !isPublicEndpoint(url)) {
      clearSessionAndGoToLogin();
    }

    return Promise.reject(error);
  }
);

export default api;
