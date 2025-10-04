/**
 * Submission API Module
 * Handles all submission-related API calls
 */
import apiClient from "@/utils/apiClient";
import { handleApiError } from "@/utils/errorHandler";
import { API_ENDPOINTS } from "@/utils/constants";

const submissionModule = {};

/**
 * Submit a solution
 * @param {Object} params - Submission parameters
 * @param {number} params.problem_id - Problem ID
 * @param {number} params.contest_id - Contest ID (optional)
 * @param {string} params.source_code - Source code
 * @param {string} params.language - Programming language
 * @returns {Promise<{data?: Object, error?: string}>}
 */
submissionModule.submitSubmission = async ({
  problem_id,
  contest_id,
  source_code,
  language,
}) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.SUBMISSIONS, {
      problem_id,
      contest_id: contest_id ? parseInt(contest_id) : undefined,
      source_code,
      language,
    });

    return { data: response.data };
  } catch (error) {
    const handledError = handleApiError(error, {
      context: "Submit Solution",
      problemId: problem_id,
      language,
    });

    return { error: handledError.error };
  }
};

/**
 * Get submission by ID
 * @param {number|string} submissionId - Submission ID
 * @returns {Promise<{data?: Object, error?: string}>}
 */
submissionModule.getSubmission = async (submissionId) => {
  // Input validation
  if (!submissionId) {
    return { error: "Submission ID is required" };
  }

  const numericId = parseInt(submissionId);
  if (isNaN(numericId) || numericId <= 0) {
    return { error: "Invalid submission ID format" };
  }

  try {
    const response = await apiClient.get(
      API_ENDPOINTS.SUBMISSION_BY_ID(numericId)
    );

    return { data: response.data };
  } catch (error) {
    const handledError = handleApiError(error, {
      context: "Get Submission",
      submissionId,
    });

    if (error.status === 401) {
      return { error: "Invalid or expired token" };
    }
    if (error.status === 403) {
      return { error: "Access denied" };
    }
    if (error.status === 404) {
      return { error: "Submission not found" };
    }

    return { error: handledError.error };
  }
};

/**
 * Get all submissions for the current user
 * @returns {Promise<{data?: Array, error?: string}>}
 */
submissionModule.getSubmissions = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.SUBMISSIONS);
    const submissions = response.data;

    // Ensure submissions is always an array
    if (!Array.isArray(submissions)) {
      return { data: [] };
    }

    return { data: submissions };
  } catch (error) {
    const handledError = handleApiError(error, {
      context: "Get Submissions",
    });

    if (error.status === 401) {
      return { error: "Invalid or expired token" };
    }
    if (error.status === 403) {
      return { error: "Access denied" };
    }
    if (error.status === 404) {
      return { error: "No submissions found" };
    }

    return { error: handledError.error };
  }
};

/**
 * Get submissions by contest ID
 * @param {number|string} contestId - Contest ID
 * @returns {Promise<{data?: Array, error?: string}>}
 */
submissionModule.getSubmissionsByContest = async (contestId) => {
  // Input validation
  if (!contestId) {
    return { error: "Contest ID is required" };
  }

  const numericId = parseInt(contestId);
  if (isNaN(numericId) || numericId <= 0) {
    return { error: "Invalid contest ID format" };
  }

  try {
    const response = await apiClient.get(
      `${API_ENDPOINTS.SUBMISSIONS}?contest_id=${numericId}`
    );
    const submissions = response.data;

    // Ensure submissions is always an array
    if (!Array.isArray(submissions)) {
      return { data: [] };
    }

    return { data: submissions };
  } catch (error) {
    const handledError = handleApiError(error, {
      context: "Get Contest Submissions",
      contestId,
    });

    if (error.status === 401) {
      return { error: "Invalid or expired token" };
    }
    if (error.status === 403) {
      return { error: "Access denied to contest" };
    }
    if (error.status === 404) {
      return { error: "Contest not found" };
    }

    return { error: handledError.error };
  }
};

export default submissionModule;
