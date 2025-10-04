/**
 * Problem API Module
 * Handles all problem-related API calls
 */
import apiClient from "@/utils/apiClient";
import { handleApiError } from "@/utils/errorHandler";
import { API_ENDPOINTS } from "@/utils/constants";

const problemModule = {};

/**
 * Get problem by ID
 * @param {number|string} problemId - Problem ID
 * @returns {Promise<{data?: Object, error?: string}>}
 */
problemModule.getProblem = async (problemId) => {
  // Input validation
  if (!problemId) {
    return { error: "Problem ID is required" };
  }

  // Validate problemId is a valid number or string that can be converted to number
  const numericId = parseInt(problemId);
  if (isNaN(numericId) || numericId <= 0) {
    return { error: "Invalid problem ID format" };
  }

  try {
    const response = await apiClient.get(
      API_ENDPOINTS.PROBLEM_BY_ID(numericId)
    );
    const problemData = response.data;

    // Ensure test_cases is always an array (handle null/undefined)
    if (!problemData.test_cases || !Array.isArray(problemData.test_cases)) {
      problemData.test_cases = [];
    }

    // Ensure numeric fields are properly typed
    if (problemData.time_limit) {
      problemData.time_limit = parseInt(problemData.time_limit);
    }
    if (problemData.memory_limit) {
      problemData.memory_limit = parseInt(problemData.memory_limit);
    }
    if (problemData.id) {
      problemData.id = parseInt(problemData.id);
    }
    if (problemData.created_by) {
      problemData.created_by = parseInt(problemData.created_by);
    }

    return { data: problemData };
  } catch (error) {
    const handledError = handleApiError(error, {
      context: "Get Problem",
      problemId,
    });

    if (error.status === 401) {
      return { error: "Invalid or expired token" };
    }
    if (error.status === 403) {
      return { error: "Access denied" };
    }
    if (error.status === 404) {
      return { error: "Problem not found" };
    }

    return { error: handledError.error };
  }
};

/**
 * Update problem
 * @param {Object} problem - Problem data with ID
 * @returns {Promise<{data?: Object, error?: string}>}
 */
problemModule.updateProblem = async (problem) => {
  try {
    // Helper function to safely stringify content if it's not already a string
    const safeStringify = (content) => {
      if (typeof content === "string") {
        return content;
      }
      return JSON.stringify(content);
    };

    const response = await apiClient.put(API_ENDPOINTS.PROBLEMS, {
      id: problem.id,
      title: problem.title,
      slug: problem.slug,
      statement: safeStringify(problem.statement),
      input_statement: safeStringify(problem.input_statement),
      output_statement: safeStringify(problem.output_statement),
      time_limit: parseInt(problem.time_limit),
      memory_limit: parseInt(problem.memory_limit),
      test_cases: problem.test_cases,
    });

    return { data: response.data };
  } catch (error) {
    const handledError = handleApiError(error, {
      context: "Update Problem",
      problemId: problem.id,
    });

    if (error.status === 401) {
      return { error: "Invalid or expired token" };
    }

    return { error: handledError.error };
  }
};

export default problemModule;
