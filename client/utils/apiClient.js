/**
 * Centralized API client with interceptors for authentication and error handling
 */
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Create axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

/**
 * Request interceptor to add authentication token
 */
apiClient.interceptors.request.use(
  (config) => {
    // Only access localStorage on client side
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          if (userData.access_token) {
            config.headers.Authorization = `Bearer ${userData.access_token}`;
          }
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
          // Clear invalid data
          localStorage.removeItem("user");
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle common errors
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        error: "Network error - unable to connect to server",
        status: null,
        originalError: error,
      });
    }

    const { status, data } = error.response;

    // Handle authentication errors globally
    if (status === 401) {
      // Clear invalid token
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        // Optionally redirect to login
        // window.location.href = '/login';
      }
    }

    // Return standardized error object
    return Promise.reject({
      error: data?.message || `Server error: ${status}`,
      status,
      data,
      originalError: error,
    });
  }
);

/**
 * Helper function to handle API responses consistently
 * @param {Promise} promise - Axios promise
 * @returns {Promise<{data?: any, error?: string}>}
 */
export const handleApiResponse = async (promise) => {
  try {
    const response = await promise;
    return { data: response.data };
  } catch (error) {
    // If it's our custom error from interceptor
    if (error.error) {
      return { error: error.error, status: error.status };
    }
    // Fallback for unexpected errors
    return {
      error: error.message || "An unexpected error occurred",
      status: error.status || null,
    };
  }
};

export default apiClient;
