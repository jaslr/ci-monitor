import { b as private_env } from "./shared-server.js";
const SESSION_COOKIE = "observatory_session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1e3;
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
function verifyCredentials(username, password) {
  const storedUsernameHash = private_env.AUTH_USERNAME_HASH;
  const storedPasswordHash = private_env.AUTH_PASSWORD_HASH;
  if (!storedUsernameHash || !storedPasswordHash) {
    console.warn("AUTH_USERNAME_HASH or AUTH_PASSWORD_HASH not set - auth disabled");
    return true;
  }
  return simpleHash(username) === storedUsernameHash && simpleHash(password) === storedPasswordHash;
}
function createSession() {
  const timestamp = Date.now();
  const payload = `${timestamp}`;
  const signature = createSignature(payload);
  return `${payload}.${signature}`;
}
function createSignature(payload) {
  const secret = private_env.AUTH_PASSWORD_HASH || "default-secret";
  return simpleHash(payload + secret);
}
function getSessionCookie() {
  return {
    name: SESSION_COOKIE,
    options: {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: SESSION_DURATION / 1e3
      // in seconds
    }
  };
}
function validateSession(token) {
  if (!token) return false;
  if (!private_env.AUTH_PASSWORD_HASH) return true;
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return false;
    const expectedSignature = createSignature(payload);
    if (signature !== expectedSignature) return false;
    const timestamp = parseInt(payload, 10);
    if (isNaN(timestamp)) return false;
    const age = Date.now() - timestamp;
    if (age > SESSION_DURATION) return false;
    return true;
  } catch {
    return false;
  }
}
function getApiSecret() {
  return private_env.API_SECRET || "";
}
export {
  validateSession as a,
  getApiSecret as b,
  createSession as c,
  getSessionCookie as g,
  verifyCredentials as v
};
