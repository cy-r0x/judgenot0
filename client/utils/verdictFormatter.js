/**
 * Verdict Formatter Utility
 * Handles verdict display logic for submissions
 */

/**
 * Get full verdict name from short code
 * @param {string} verdict - Verdict code (ac, wa, tle, mle, re, pending, running)
 * @returns {string} Full verdict name
 */
export const getVerdictName = (verdict) => {
  const verdictMap = {
    ac: "Accepted",
    wa: "Wrong Answer",
    tle: "Time Limit Exceeded",
    mle: "Memory Limit Exceeded",
    re: "Runtime Error",
    ce: "Compilation Error",
    pending: "Pending",
    running: "Running",
  };

  return verdictMap[verdict?.toLowerCase()] || verdict || "Unknown";
};

/**
 * Get color class for verdict
 * @param {string} verdict - Verdict code
 * @returns {string} Tailwind color class
 */
export const getVerdictColor = (verdict) => {
  const lowerVerdict = verdict?.toLowerCase();

  switch (lowerVerdict) {
    case "ac":
    case "accepted":
      return "text-green-500";
    case "wa":
    case "wrong answer":
      return "text-red-500";
    case "tle":
    case "time limit exceeded":
      return "text-purple-500";
    case "mle":
    case "memory limit exceeded":
      return "text-orange-500";
    case "re":
    case "runtime error":
      return "text-pink-500";
    case "ce":
    case "compilation error":
      return "text-yellow-500";
    case "pending":
      return "text-yellow-400";
    case "running":
      return "text-blue-500";
    default:
      return "text-gray-500";
  }
};

/**
 * Get background color class for verdict card
 * @param {string} verdict - Verdict code
 * @returns {string} Tailwind background color class
 */
export const getVerdictBgColor = (verdict) => {
  const lowerVerdict = verdict?.toLowerCase();

  switch (lowerVerdict) {
    case "ac":
    case "accepted":
      return "bg-green-900/20";
    case "wa":
    case "wrong answer":
      return "bg-red-900/20";
    case "tle":
    case "time limit exceeded":
      return "bg-purple-900/20";
    case "mle":
    case "memory limit exceeded":
      return "bg-orange-900/20";
    case "re":
    case "runtime error":
      return "bg-pink-900/20";
    case "ce":
    case "compilation error":
      return "bg-yellow-900/20";
    case "pending":
      return "bg-yellow-900/20";
    case "running":
      return "bg-blue-900/20";
    default:
      return "bg-gray-900/20";
  }
};
