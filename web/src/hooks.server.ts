import { redirect, type Handle } from '@sveltejs/kit';
import { validateSession, getSessionCookie, getApiSecret } from '$lib/server/auth';

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login'];

export const handle: Handle = async ({ event, resolve }) => {
	const { cookies, url } = event;
	const sessionCookie = getSessionCookie();

	// Get session token from cookie
	const sessionToken = cookies.get(sessionCookie.name);

	// Check if route is public
	const isPublicRoute = PUBLIC_ROUTES.some((route) => url.pathname.startsWith(route));

	// Validate session
	const isAuthenticated = validateSession(sessionToken);

	// Store auth state in locals for use in pages
	event.locals.isAuthenticated = isAuthenticated;
	event.locals.apiSecret = isAuthenticated ? getApiSecret() : '';

	// Redirect unauthenticated users to login
	if (!isPublicRoute && !isAuthenticated) {
		throw redirect(303, '/login');
	}

	// Redirect authenticated users away from login
	if (url.pathname === '/login' && isAuthenticated) {
		throw redirect(303, '/');
	}

	return resolve(event);
};
