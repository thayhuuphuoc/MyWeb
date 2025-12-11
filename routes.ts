export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
  "/auth/new-verification",
];

export const apiAuthPrefix = "/api/auth";
export const dashboardAuthPrefix = "/dashboard";


/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard/settings";
