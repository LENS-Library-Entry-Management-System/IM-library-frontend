import axios from "axios";
import type { AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// Attach access token if present
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Attach access token to headers in a type-safe way
  const token = (() => {
    try {
      return localStorage.getItem("accessToken");
    } catch {
      return null;
    }
  })();

  if (token) {
    const existing = (config.headers || {}) as Record<string, string>;
    const merged: Record<string, string> = {
      ...existing,
      Authorization: `Bearer ${token}`,
    };
    config.headers = merged as AxiosRequestHeaders;
  }

  return config;
});

export default client;
