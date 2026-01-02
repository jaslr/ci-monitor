import { redirect } from "@sveltejs/kit";
import { g as getSessionCookie, a as validateSession, b as getApiSecret } from "./auth.js";
const PUBLIC_ROUTES = ["/login"];
const handle = async ({ event, resolve }) => {
  const { cookies, url } = event;
  const sessionCookie = getSessionCookie();
  const sessionToken = cookies.get(sessionCookie.name);
  const isPublicRoute = PUBLIC_ROUTES.some((route) => url.pathname.startsWith(route));
  const isAuthenticated = validateSession(sessionToken);
  event.locals.isAuthenticated = isAuthenticated;
  event.locals.apiSecret = isAuthenticated ? getApiSecret() : "";
  if (!isPublicRoute && !isAuthenticated) {
    throw redirect(303, "/login");
  }
  if (url.pathname === "/login" && isAuthenticated) {
    throw redirect(303, "/");
  }
  return resolve(event);
};
export {
  handle
};
