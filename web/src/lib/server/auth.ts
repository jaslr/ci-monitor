// Simple password authentication for single-user access
// Stateless auth that works with Cloudflare Pages workers
import { env } from '$env/dynamic/private';

const SESSION_COOKIE = 'observatory_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Simple hash function for password verification
function simpleHash(str: string): string {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}
	return Math.abs(hash).toString(36);
}

export function verifyCredentials(username: string, password: string): boolean {
	const storedUsernameHash = env.AUTH_USERNAME_HASH;
	const storedPasswordHash = env.AUTH_PASSWORD_HASH;

	if (!storedUsernameHash || !storedPasswordHash) {
		console.warn('AUTH_USERNAME_HASH or AUTH_PASSWORD_HASH not set - auth disabled');
		return true; // Allow access if no credentials configured
	}

	return simpleHash(username) === storedUsernameHash &&
	       simpleHash(password) === storedPasswordHash;
}

// Kept for backwards compatibility
export function verifyPassword(password: string): boolean {
	const storedHash = env.AUTH_PASSWORD_HASH;
	if (!storedHash) {
		return true;
	}
	return simpleHash(password) === storedHash;
}

export function hashPassword(password: string): string {
	return simpleHash(password);
}

// Create a signed session token (stateless)
export function createSession(): string {
	const timestamp = Date.now();
	const payload = `${timestamp}`;
	const signature = createSignature(payload);
	return `${payload}.${signature}`;
}

// Create a signature for the payload using the password hash as secret
function createSignature(payload: string): string {
	const secret = env.AUTH_PASSWORD_HASH || 'default-secret';
	return simpleHash(payload + secret);
}

export function getSessionCookie(): {
	name: string;
	options: {
		path: string;
		httpOnly: boolean;
		secure: boolean;
		sameSite: 'lax' | 'strict' | 'none';
		maxAge: number;
	};
} {
	return {
		name: SESSION_COOKIE,
		options: {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: SESSION_DURATION / 1000 // in seconds
		}
	};
}

// Validate session token (stateless - verifies signature and expiry)
export function validateSession(token: string | undefined): boolean {
	if (!token) return false;

	// If no password is configured, all requests are allowed
	if (!env.AUTH_PASSWORD_HASH) return true;

	try {
		const [payload, signature] = token.split('.');
		if (!payload || !signature) return false;

		// Verify signature
		const expectedSignature = createSignature(payload);
		if (signature !== expectedSignature) return false;

		// Check expiry
		const timestamp = parseInt(payload, 10);
		if (isNaN(timestamp)) return false;

		const age = Date.now() - timestamp;
		if (age > SESSION_DURATION) return false;

		return true;
	} catch {
		return false;
	}
}

// These are no-ops for stateless auth but kept for API compatibility
export function addSession(_token: string): void {
	// No-op: sessions are self-validating
}

export function removeSession(_token: string): void {
	// No-op: logout just clears the cookie
}

// Get the API secret for backend communication
export function getApiSecret(): string {
	return env.API_SECRET || '';
}
