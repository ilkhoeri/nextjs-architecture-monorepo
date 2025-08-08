/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const API_PREFIX: string = '/api/';

/**
 * The default route login `/auth/sign-in`
 * @type {string}
 */
export const SIGNIN_ROUTE: string = '/auth/sign-in';

/**
 * The default route register `/auth/sign-up`
 * @type {string}
 */
export const SIGNUP_ROUTE: string = '/auth/sign-up';

/**
 * The default route register `/auth/sign-up`
 * @type {string}
 */
export const VERIFICATION_ROUTE: string = '/auth/verification';

/**
 * The default route register `/auth/sign-up`
 * @type {string}
 */
export const INVITATION_ROUTE: string = '/auth/invitation';

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const SIGNIN_REDIRECT: string = '/';

/**
 * List of API endpoints and routes that other parties are allowed to access
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const PUBLIC_ROUTES: string[] = [
  // routes
  SIGNIN_ROUTE,
  VERIFICATION_ROUTE,
  INVITATION_ROUTE,
  // API
  '/api/webhooks'
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const AUTH_ROUTES: string[] = [
  // Authentication routes
  SIGNIN_ROUTE,
  VERIFICATION_ROUTE,
  INVITATION_ROUTE,
  '/auth/sign-up',
  '/auth/reset',
  '/auth/new-password',
  '/auth/error'
];
