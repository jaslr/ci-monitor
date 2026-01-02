import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Redirect to media section by default
	throw redirect(302, '/admin/media');
};
