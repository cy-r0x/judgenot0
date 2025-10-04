/**
 * Date formatting utilities
 * Provides consistent and safe date formatting across the application
 */

/**
 * Safely format a date string
 * @param {string|Date} dateValue - Date value to format
 * @param {Intl.DateTimeFormatOptions} options - Intl formatting options
 * @param {string} fallback - Fallback value if date is invalid
 * @returns {string} Formatted date string or fallback
 */
export const safeFormatDate = (dateValue, options = {}, fallback = "N/A") => {
  if (!dateValue) {
    return fallback;
  }

  try {
    const date = new Date(dateValue);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date value:", dateValue);
      return fallback;
    }

    return new Intl.DateTimeFormat("en-US", options).format(date);
  } catch (error) {
    console.error("Error formatting date:", error, dateValue);
    return fallback;
  }
};

/**
 * Format date with full details (for submission details, etc.)
 * @param {string|Date} dateValue - Date value to format
 * @returns {string} Formatted date string
 */
export const formatFullDate = (dateValue) => {
  return safeFormatDate(dateValue, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

/**
 * Format date concisely (for tables, lists, etc.)
 * @param {string|Date} dateValue - Date value to format
 * @returns {string} Formatted date string
 */
export const formatShortDate = (dateValue) => {
  return safeFormatDate(dateValue, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format date with time (for contest start/end times)
 * @param {string|Date} dateValue - Date value to format
 * @returns {string} Formatted date string
 */
export const formatDateTime = (dateValue) => {
  return safeFormatDate(dateValue, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format duration in seconds to human-readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 */
export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) {
    return "0m";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  if (minutes > 0) {
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
  }
  return `${secs}s`;
};

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param {string|Date} dateValue - Date value
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateValue) => {
  if (!dateValue) {
    return "N/A";
  }

  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${
        diffInMinutes === 1 ? "minute" : "minutes"
      } ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    } else {
      return formatShortDate(date);
    }
  } catch (error) {
    console.error("Error calculating relative time:", error);
    return "Invalid Date";
  }
};

/**
 * Check if a date is in the future
 * @param {string|Date} dateValue - Date value to check
 * @returns {boolean} True if date is in the future
 */
export const isFutureDate = (dateValue) => {
  if (!dateValue) return false;

  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return false;

    return date > new Date();
  } catch (error) {
    return false;
  }
};

/**
 * Check if a date is in the past
 * @param {string|Date} dateValue - Date value to check
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (dateValue) => {
  if (!dateValue) return false;

  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return false;

    return date < new Date();
  } catch (error) {
    return false;
  }
};
