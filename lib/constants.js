/**
 * Shared constants.
 *
 * Kept in a dependency-free module so that `proxy.js` can import the cookie
 * name without pulling `next/headers` into the proxy bundle.
 */

export const SESSION_COOKIE = "fbc_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours
