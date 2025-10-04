/**
 * Centralized error handling utilities
 */

/**
 * Error types for categorization
 */
export const ErrorTypes = {
  NETWORK: "NETWORK_ERROR",
  AUTH: "AUTH_ERROR",
  VALIDATION: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  SERVER: "SERVER_ERROR",
  UNKNOWN: "UNKNOWN_ERROR",
};

/**
 * Map HTTP status codes to error types
 */
export const getErrorType = (status) => {
  if (!status) return ErrorTypes.NETWORK;
  if (status === 401 || status === 403) return ErrorTypes.AUTH;
  if (status === 404) return ErrorTypes.NOT_FOUND;
  if (status === 422) return ErrorTypes.VALIDATION;
  if (status >= 500) return ErrorTypes.SERVER;
  return ErrorTypes.UNKNOWN;
};

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (
  error,
  defaultMessage = "An error occurred"
) => {
  if (typeof error === "string") return error;
  if (error?.error) return error.error;
  if (error?.message) return error.message;
  return defaultMessage;
};

/**
 * Log error for debugging (can be extended to send to external service)
 */
export const logError = (error, context = {}) => {
  if (process.env.NODE_ENV === "development") {
    console.group("🚨 Error Log");
    console.error("Error:", error);
    console.log("Context:", context);
    console.log("Timestamp:", new Date().toISOString());
    console.groupEnd();
  }

  // In production, you could send to error tracking service
  // e.g., Sentry, LogRocket, etc.
};

/**
 * Handle API errors with proper logging and user feedback
 */
export const handleApiError = (error, context = {}) => {
  const errorMessage = getErrorMessage(error);
  const errorType = getErrorType(error?.status);

  logError(
    {
      message: errorMessage,
      type: errorType,
      status: error?.status,
      originalError: error,
    },
    context
  );

  return {
    error: errorMessage,
    type: errorType,
    status: error?.status,
  };
};
