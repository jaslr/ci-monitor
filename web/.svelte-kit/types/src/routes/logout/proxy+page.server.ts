// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getSessionCookie, removeSession } from '$lib/server/auth';

export const actions = {
	default: async ({ cookies }: import('./$types').RequestEvent) => {
		const { name, options } = getSessionCookie();
		const sessionToken = cookies.get(name);

		if (sessionToken) {
			removeSession(sessionToken);
		}

		// Clear the cookie
		cookies.delete(name, { path: options.path });

		throw redirect(303, '/login');
	}
};
;null as any as Actions;