/**
 * Application-wide constants
 */

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  SETTER: "setter",
  USER: "user",
  PARTICIPANT: "participant",
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/api/user/login",
  REGISTER: "/api/user/register",

  // Contests
  CONTESTS: "/api/contests",
  CONTEST_BY_ID: (id) => `/api/contests/${id}`,
  CONTEST_ASSIGN: "/api/contests/assign",
  CONTEST_PROBLEMS: (id) => `/api/contests/problems/${id}`,
  CONTEST_STANDINGS: (id) => `/api/standings/${id}`,

  // Problems
  PROBLEMS: "/api/problems",
  PROBLEM_BY_ID: (id) => `/api/problems/${id}`,
  SETTER_PROBLEMS: "/api/setter",

  // Submissions
  SUBMISSIONS: "/api/submissions",
  SUBMISSION_BY_ID: (id) => `/api/submissions/${id}`,

  // Users
  CONTEST_USERS: (contestId) => `/api/user/${contestId}`,
};

// Local storage keys
export const STORAGE_KEYS = {
  USER: "user",
  TOKEN: "access_token",
  THEME: "theme",
};

// Contest status
export const CONTEST_STATUS = {
  UPCOMING: "UPCOMING",
  RUNNING: "RUNNING",
  ENDED: "ENDED",
};

// Submission status
export const SUBMISSION_STATUS = {
  PENDING: "PENDING",
  IN_QUEUE: "In Queue",
  JUDGING: "Judging",
  ACCEPTED: "Accepted",
  WRONG_ANSWER: "Wrong Answer",
  TIME_LIMIT_EXCEEDED: "Time Limit Exceeded",
  MEMORY_LIMIT_EXCEEDED: "Memory Limit Exceeded",
  RUNTIME_ERROR: "Runtime Error",
  COMPILATION_ERROR: "Compilation Error",
};

// Programming languages
export const LANGUAGES = {
  CPP: "cpp",
  JAVA: "java",
  PYTHON: "py",
  JAVASCRIPT: "js",
};
