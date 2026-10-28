/** Read the "exp" (seconds since 1970) from a JWT without verifying it. */
export function getTokenExpiry(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(payload)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json).exp || null;
  } catch (e) {
    return null;
  }
}

/** true when the token is missing, unreadable or already expired (30s safety margin). */
export function isTokenExpired(token) {
  if (!token) return true;
  const exp = getTokenExpiry(token);
  if (!exp) return true;
  return exp * 1000 <= Date.now() + 30000;
}
