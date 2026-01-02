// @ts-nocheck
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

interface Logo {
	id: string;
	name: string;
	url: string;
	type: 'infra' | 'techstack';
}

// API route prefix for serving logos
const LOGOS_API_PREFIX = '/api/logos';

export const load = async ({ platform }: Parameters<PageServerLoad>[0]) => {
	const bucket = platform?.env?.LOGOS_BUCKET;
	if (!bucket) {
		console.warn('R2 bucket not configured');
		return { logos: [] };
	}

	try {
		// List all objects in the bucket
		const listed = await bucket.list();
		const logos: Logo[] = [];

		for (const obj of listed.objects) {
			// Parse metadata from key: {type}/{name}.{ext}
			const parts = obj.key.split('/');
			const type = parts[0] as 'infra' | 'techstack';
			const filename = parts.slice(1).join('/');
			const name = filename.replace(/\.(svg|png)$/i, '');

			logos.push({
				id: obj.key,
				name,
				url: `${LOGOS_API_PREFIX}/${obj.key}`,
				type
			});
		}

		return { logos };
	} catch (err) {
		console.error('Failed to list logos from R2:', err);
		return { logos: [] };
	}
};

export const actions = {
	uploadLogo: async ({ request, platform }: import('./$types').RequestEvent) => {
		const bucket = platform?.env?.LOGOS_BUCKET;
		if (!bucket) {
			return fail(500, { error: 'R2 bucket not configured' });
		}

		const formData = await request.formData();
		const file = formData.get('logo') as File | null;
		const type = formData.get('type') as 'infra' | 'techstack';

		if (!file || file.size === 0) {
			return fail(400, { error: 'No file selected' });
		}

		// Validate file type
		const validTypes = ['image/svg+xml', 'image/png'];
		if (!validTypes.includes(file.type)) {
			return fail(400, { error: 'Invalid file type. Only SVG and PNG are allowed.' });
		}

		// Validate file size (1MB max)
		if (file.size > 1024 * 1024) {
			return fail(400, { error: 'File too large. Maximum size is 1MB.' });
		}

		try {
			// Generate key: {type}/{filename}
			const ext = file.type === 'image/svg+xml' ? 'svg' : 'png';
			// Use provided filename if available, otherwise use uploaded file name
			const providedFilename = formData.get('filename') as string | null;
			const baseName = providedFilename || file.name.replace(/\.(svg|png)$/i, '').replace(/[^a-zA-Z0-9-_]/g, '-');
			const key = `${type}/${baseName}.${ext}`;

			// Read file as ArrayBuffer
			const arrayBuffer = await file.arrayBuffer();

			// Upload to R2
			await bucket.put(key, arrayBuffer, {
				httpMetadata: {
					contentType: file.type
				}
			});

			return { success: true, message: `Logo "${baseName}" uploaded successfully!` };
		} catch (err) {
			console.error('Failed to upload to R2:', err);
			return fail(500, { error: 'Failed to upload logo' });
		}
	},

	deleteLogo: async ({ request, platform }: import('./$types').RequestEvent) => {
		const bucket = platform?.env?.LOGOS_BUCKET;
		if (!bucket) {
			return fail(500, { error: 'R2 bucket not configured' });
		}

		const formData = await request.formData();
		const logoId = formData.get('logoId') as string;

		if (!logoId) {
			return fail(400, { error: 'No logo ID provided' });
		}

		try {
			// Delete from R2
			await bucket.delete(logoId);

			const name = logoId.split('/').pop()?.replace(/\.(svg|png)$/i, '') || logoId;
			return { success: true, message: `Logo "${name}" deleted.` };
		} catch (err) {
			console.error('Failed to delete from R2:', err);
			return fail(500, { error: 'Failed to delete logo' });
		}
	}
};
;null as any as Actions;