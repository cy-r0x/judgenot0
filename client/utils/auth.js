/**
 * Authentication utilities for token and user management
 */
import { STORAGE_KEYS, USER_ROLES } from "./constants";

/**
 * Get user data from localStorage
 * @returns {Object|null} User data or null
 */
export const getUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    localStorage.removeItem(STORAGE_KEYS.USER);
    return null;
  }
};

/**
 * Set user data in localStorage
 * @param {Object} userData - User data to store
 */
export const setUser = (userData) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

/**
 * Remove user data from localStorage
 */
export const clearUser = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Get authentication token
 * @returns {string|null} Token or null
 */
export const getToken = () => {
  const user = getUser();
  return user?.access_token || null;
};

/**
 * Get user role
 * @returns {string|null} User role or null
 */
export const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};

/**
 * Get user ID
 * @returns {number|null} User ID or null
 */
export const getUserId = () => {
  const user = getUser();
  return user?.id || null;
};

/**
 * Get username
 * @returns {string|null} Username or null
 */
export const getUsername = () => {
  const user = getUser();
  return user?.username || null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Check if user has a specific role
 * @param {string} role - Role to check
 * @returns {boolean} True if user has the role
 */
export const hasRole = (role) => {
  return getUserRole() === role;
};

/**
 * Check if user is admin
 * @returns {boolean} True if user is admin
 */
export const isAdmin = () => {
  return hasRole(USER_ROLES.ADMIN);
};

/**
 * Check if user is setter
 * @returns {boolean} True if user is setter
 */
export const isSetter = () => {
  return hasRole(USER_ROLES.SETTER);
};

/**
 * Check if user can access a route based on role
 * @param {string|string[]} allowedRoles - Allowed role(s)
 * @returns {boolean} True if user can access
 */
export const canAccessRoute = (allowedRoles) => {
  if (!isAuthenticated()) return false;

  const userRole = getUserRole();
  if (!userRole) return false;

  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(userRole);
  }

  return userRole === allowedRoles;
};

/**
 * Validate token expiration (if token includes exp claim)
 * @returns {boolean} True if token is valid
 */
export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;

  try {
    // If using JWT, you can decode and check expiration
    // For now, just check if token exists
    return true;
  } catch (error) {
    return false;
  }
};
