// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			isAuthenticated: boolean;
			apiSecret: string;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env?: {
				LOGOS_BUCKET?: R2Bucket;
			};
		}
	}
}

// R2 types from Cloudflare Workers
interface R2Bucket {
	put(
		key: string,
		value: ArrayBuffer | string | ReadableStream,
		options?: R2PutOptions
	): Promise<R2Object>;
	get(key: string): Promise<R2ObjectBody | null>;
	delete(key: string | string[]): Promise<void>;
	list(options?: R2ListOptions): Promise<R2Objects>;
}

interface R2PutOptions {
	httpMetadata?: {
		contentType?: string;
		cacheControl?: string;
	};
	customMetadata?: Record<string, string>;
}

interface R2ListOptions {
	prefix?: string;
	limit?: number;
	cursor?: string;
}

interface R2Object {
	key: string;
	version: string;
	size: number;
	etag: string;
	httpMetadata?: Record<string, string>;
	customMetadata?: Record<string, string>;
	uploaded: Date;
}

interface R2ObjectBody extends R2Object {
	body: ReadableStream;
	arrayBuffer(): Promise<ArrayBuffer>;
	text(): Promise<string>;
	json<T>(): Promise<T>;
}

interface R2Objects {
	objects: R2Object[];
	truncated: boolean;
	cursor?: string;
}

export {};
