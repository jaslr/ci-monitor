// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { verifyCredentials, createSession, addSession, getSessionCookie } from '$lib/server/auth';

export const actions = {
	default: async ({ request, cookies }: import('./$types').RequestEvent) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		if (!username || typeof username !== 'string') {
			return fail(400, { error: 'Email is required' });
		}

		if (!password || typeof password !== 'string') {
			return fail(400, { error: 'Password is required' });
		}

		if (!verifyCredentials(username, password)) {
			return fail(401, { error: 'Invalid credentials' });
		}

		// Create session
		const sessionToken = createSession();
		addSession(sessionToken);

		// Set session cookie
		const { name, options } = getSessionCookie();
		cookies.set(name, sessionToken, options);

		// Redirect to home
		throw redirect(303, '/');
	}
};
;null as any as Actions;