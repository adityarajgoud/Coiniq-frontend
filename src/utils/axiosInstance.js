// src/utils/axiosInstance.js

import axios from "axios";

let activeRequests = 0;
let setGlobalLoading = null;

// Allow global loading to be registered from context
export const registerGlobalLoader = (setLoading) => {
  setGlobalLoading = setLoading;
};

// Create axios instance with baseURL from .env (CRA uses REACT_APP_ prefix)
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 8000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Interceptors to track request/response and toggle loading state
api.interceptors.request.use(
  (config) => {
    activeRequests++;
    if (setGlobalLoading) setGlobalLoading(true);
    return config;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0 && setGlobalLoading) setGlobalLoading(false);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0 && setGlobalLoading) setGlobalLoading(false);
    return response;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0 && setGlobalLoading) setGlobalLoading(false);
    return Promise.reject(error);
  }
);

export default api;
