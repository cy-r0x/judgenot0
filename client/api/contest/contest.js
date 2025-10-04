/**
 * Contest API Module
 * Handles all contest-related API calls
 */
import apiClient from "@/utils/apiClient";
import { handleApiError } from "@/utils/errorHandler";
import { API_ENDPOINTS } from "@/utils/constants";

const contestModule = {};

/**
 * Get all contests
 * @returns {Promise<{data?: Array, error?: string}>}
 */
contestModule.getContests = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CONTESTS);
    const contests = response.data;

    // Ensure contests is always an array
    if (!Array.isArray(contests)) {
      return { data: [] };
    }

    return { data: contests };
  } catch (error) {
    const handledError = handleApiError(error, {
      context: "Get Contests",
    });

    if (error.status === 401) {
      return { error: "Invalid or expired token" };
    }
    if (error.status === 403) {
      return { error: "Access denied" };
    }

    return { error: handledError.error };
  }
};

/**
 * Get contest by ID
 * @param {number|string} contestId - Contest ID
 * @returns {Promise<{data?: Object, error?: string}>}
 */
contestModule.getContest = async (contestId) => {
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
      API_ENDPOINTS.CONTEST_BY_ID(numericId)
    );
    const contestData = response.data;

    // Ensure numeric fields are properly typed
    if (contestData.contest?.id) {
      contestData.contest.id = parseInt(contestData.contest.id);
    }
    if (contestData.contest?.duration_seconds) {
      contestData.contest.duration_seconds = parseInt(
        contestData.contest.duration_seconds
      );
    }

    return { data: contestData };
  } catch (error) {
    const handledError = handleApiError(error, {
      context: "Get Contest",
      contestId,
    });

    if (error.status === 401) {
      return { error: "Invalid or expired token" };
    }
    if (error.status === 403) {
      return { error: "Access denied" };
    }
    if (error.status === 404) {
      return { error: "Contest not found" };
    }

    return { error: handledError.error };
  }
};

/**
 * Create new contest (Admin only)
 * @param {Object} contestData - Contest data
 * @returns {Promise<{data?: Object, error?: string}>}
 */
contestModule.createContest = async (contestData) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.CONTESTS, {
      title: contestData.title,
      description: contestData.description || "",
      start_time: contestData.start_time,
      duration_seconds: parseInt(contestData.duration_seconds),
    });

    return { data: response.data };
  } catch (error) {
    const handledError = handleApiError(error, {
      context: "Create Contest",
    });

    if (error.status === 401) {
      return { error: "Invalid or expired token" };
    }

    return { error: handledError.error };
  }
};

/**
 * Update contest (Admin only)
 * @param {Object} contest - Contest data with ID
 * @returns {Promise<{data?: Object, error?: string}>}
 */
contestModule.updateContest = async (contest) => {
  try {
    const response = await apiClient.put(API_ENDPOINTS.CONTESTS, {
      id: contest.id,
      title: contest.title,
      description: contest.description,
      start_time: contest.start_time,
      duration_seconds: parseInt(contest.duration_seconds),
    });

    return { data: response.data };
  } catch (error) {
    const handledError = handleApiError(error, {
      context: "Update Contest",
      contestId: contest.id,
    });

    if (error.status === 401) {
      return { error: "Invalid or expired token" };
    }

    return { error: handledError.error };
  }
};

/**
 * Assign problem to contest
 * @param {Object} contestProblem - Contest problem assignment data
 * @returns {Promise<{data?: Object, error?: string}>}
 */
contestModule.assignProblem = async (contestProblem) => {
  // Input validation
  if (!contestProblem || typeof contestProblem !== "object") {
    return { error: "Contest problem data is required" };
  }

  if (!contestProblem.contest_id || !contestProblem.problem_id) {
    return { error: "Contest ID and Problem ID are required" };
  }

  try {
    const response = await apiClient.post(API_ENDPOINTS.CONTEST_ASSIGN, {
      contest_id: parseInt(contestProblem.contest_id),
      problem_id: parseInt(contestProblem.problem_id),
      index: contestProblem.index ? parseInt(contestProblem.index) : undefined,
    });

    return { data: response.data };
  } catch (error) {
    const handledError = handleApiError(error, {
      context: "Assign Problem to Contest",
      contestId: contestProblem.contest_id,
      problemId: contestProblem.problem_id,
    });

    if (error.status === 401) {
      return { error: "Invalid or expired token" };
    }
    if (error.status === 403) {
      return { error: "Access denied" };
    }
    if (error.status === 404) {
      return { error: "Contest or problem not found" };
    }
    if (error.status === 409) {
      return { error: "Problem already assigned to this contest" };
    }
    if (error.status === 422) {
      return { error: "Invalid data provided" };
    }

    return { error: handledError.error };
  }
};

/**
 * Get problems for a contest
 * @param {number|string} contestId - Contest ID
 * @returns {Promise<{data?: Array, error?: string}>}
 */
contestModule.getContestProblems = async (contestId) => {
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
      API_ENDPOINTS.CONTEST_PROBLEMS(numericId)
    );
    const problems = response.data;

    // Ensure problems is always an array
    if (!Array.isArray(problems)) {
      return { data: [] };
    }

    return { data: problems };
  } catch (error) {
    const handledError = handleApiError(error, {
      context: "Get Contest Problems",
      contestId,
    });

    if (error.status === 401) {
      return { error: "Invalid or expired token" };
    }
    if (error.status === 403) {
      return { error: "Access denied" };
    }
    if (error.status === 404) {
      return { error: "Contest not found" };
    }

    return { error: handledError.error };
  }
};

/**
 * Get standings for a contest
 * @param {number|string} contestId - Contest ID
 * @returns {Promise<{data?: Object, error?: string}>}
 */
contestModule.getContestStandings = async (contestId) => {
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
      API_ENDPOINTS.CONTEST_STANDINGS(numericId)
    );

    return { data: response.data };
  } catch (error) {
    const handledError = handleApiError(error, {
      context: "Get Contest Standings",
      contestId,
    });

    if (error.status === 401) {
      return { error: "Invalid or expired token" };
    }
    if (error.status === 403) {
      return { error: "Access denied" };
    }
    if (error.status === 404) {
      return { error: "Contest not found" };
    }

    return { error: handledError.error };
  }
};

export default contestModule;
