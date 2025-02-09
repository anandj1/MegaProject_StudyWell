import axios from "axios"

// Create axios instance with base configuration
export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "https://megaproject-studywell.onrender.com/api/v1",
  timeout: 100000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to handle auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage and remove quotes if present
    const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
    
    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors without redirect
    if (error.response?.status === 401) {
      console.log("Authentication error occurred:", error.response?.data?.message);
    }
    return Promise.reject(error);
  }
);

export const apiConnector = (method, url, bodyData, headers, params) => {
  // Get token and remove quotes if present
  const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
  
  return axiosInstance({
    method: method,
    url: url,
    data: bodyData || null,
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
    params: params || null,
  });
};