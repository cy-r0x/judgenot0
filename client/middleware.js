/**
 * Next.js Middleware for route protection
 * Runs on the server before pages load
 */
import { NextResponse } from "next/server";

// Define protected routes and their required roles
const protectedRoutes = {
  "/admin": ["admin"],
  "/setter": ["setter", "admin"],
  "/edit": ["setter", "admin"],
  "/preview": ["setter", "admin"],
};

// Public routes that don't require authentication
const publicRoutes = ["/login", "/"];

// Routes that authenticated users shouldn't access
const guestOnlyRoutes = ["/login"];

/**
 * Check if path matches a protected route
 */
function isProtectedRoute(pathname) {
  return Object.keys(protectedRoutes).some((route) =>
    pathname.startsWith(route)
  );
}

/**
 * Get required roles for a path
 */
function getRequiredRoles(pathname) {
  const route = Object.keys(protectedRoutes).find((route) =>
    pathname.startsWith(route)
  );
  return route ? protectedRoutes[route] : [];
}

/**
 * Check if path is public
 */
function isPublicRoute(pathname) {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );
}

/**
 * Check if path is guest only (like login)
 */
function isGuestOnlyRoute(pathname) {
  return guestOnlyRoutes.some((route) => pathname.startsWith(route));
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get user data from cookie or header (if you store it there)
  // For localStorage-based auth, we'll handle this client-side
  // This middleware serves as an additional layer

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // For now, we'll rely on client-side protection with HOCs
  // But you can enhance this if you store auth state in cookies/headers
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
