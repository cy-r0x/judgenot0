/**
 * User API Module
 * Handles all user-related API calls
 */
import apiClient, { handleApiResponse } from "@/utils/apiClient";
import { handleApiError } from "@/utils/errorHandler";
import { API_ENDPOINTS } from "@/utils/constants";
import { setUser, clearUser } from "@/utils/auth";

const userModule = {};

/**
 * Login user
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<{data?: Object, error?: string}>}
 */
userModule.Login = async (username, password) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
      username,
      password,
    });

    // Store user data
    setUser(response.data);
    return { data: response.data };
  } catch (error) {
    const handledError = handleApiError(error, {
      context: "User Login",
      username,
    });

    // Special handling for invalid credentials
    if (error.status === 401) {
      return { error: "Invalid username or password" };
    }

    return { error: handledError.error };
  }
};

/**
 * Register a new user (Admin only)
 * @param {Object} userData - User data
 * @returns {Promise<{data?: Object, error?: string}>}
 */
userModule.Register = async (userData) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);
    return { data: response.data };
  } catch (error) {
    const handledError = handleApiError(error, {
      context: "User Registration",
    });

    // Handle specific error cases
    if (error.status === 401) {
      return { error: "Invalid or expired token" };
    }
    if (error.status === 403) {
      return { error: "Insufficient permissions to register users" };
    }
    if (error.status === 409) {
      return { error: "User already exists" };
    }
    if (error.status === 422) {
      return { error: "Invalid user data provided" };
    }

    return { error: handledError.error };
  }
};

/**
 * Get contest users
 * @param {number} contestId - Contest ID
 * @returns {Promise<{data?: Array, error?: string}>}
 */
userModule.getContestUsers = async (contestId) => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.CONTEST_USERS(contestId)
    );
    return { data: response.data };
  } catch (error) {
    const handledError = handleApiError(error, {
      context: "Get Contest Users",
      contestId,
    });

    if (error.status === 401) {
      return { error: "Invalid or expired token" };
    }
    if (error.status === 403) {
      return { error: "Insufficient permissions" };
    }
    if (error.status === 404) {
      return { error: "Contest not found" };
    }

    return { error: handledError.error };
  }
};

/**
 * Logout user
 */
userModule.Logout = () => {
  clearUser();
};

// Export for backward compatibility
export default userModule;
