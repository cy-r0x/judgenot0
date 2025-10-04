/**
 * Setter API Module
 * Handles setter-specific API calls
 */
import apiClient from "@/utils/apiClient";
import { handleApiError } from "@/utils/errorHandler";
import { API_ENDPOINTS } from "@/utils/constants";

const setterModule = {};

/**
 * Get all problems for setter
 * @returns {Promise<{data?: Array, error?: string}>}
 */
setterModule.getProblems = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.SETTER_PROBLEMS);
    return { data: response.data };
  } catch (error) {
    const handledError = handleApiError(error, {
      context: "Get Setter Problems",
    });

    if (error.status === 401) {
      return { error: "Invalid or expired token" };
    }

    return { error: handledError.error };
  }
};

/**
 * Create new problem
 * @param {string} title - Problem title
 * @returns {Promise<{data?: Object, error?: string}>}
 */
setterModule.createProblem = async (title) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.PROBLEMS, {
      title,
    });
    return { data: response.data };
  } catch (error) {
    const handledError = handleApiError(error, {
      context: "Create Problem",
      title,
    });

    if (error.status === 401) {
      return { error: "Invalid or expired token" };
    }

    return { error: handledError.error };
  }
};

export default setterModule;
