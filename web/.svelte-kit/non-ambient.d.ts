
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/admin" | "/admin/media" | "/admin/projects" | "/admin/repos" | "/api" | "/api/logos" | "/api/logos/[...path]" | "/api/scan" | "/deployments" | "/ecosystem" | "/login" | "/logout" | "/projects";
		RouteParams(): {
			"/api/logos/[...path]": { path: string }
		};
		LayoutParams(): {
			"/": { path?: string };
			"/admin": Record<string, never>;
			"/admin/media": Record<string, never>;
			"/admin/projects": Record<string, never>;
			"/admin/repos": Record<string, never>;
			"/api": { path?: string };
			"/api/logos": { path?: string };
			"/api/logos/[...path]": { path: string };
			"/api/scan": Record<string, never>;
			"/deployments": Record<string, never>;
			"/ecosystem": Record<string, never>;
			"/login": Record<string, never>;
			"/logout": Record<string, never>;
			"/projects": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/admin/" | "/admin/media" | "/admin/media/" | "/admin/projects" | "/admin/projects/" | "/admin/repos" | "/admin/repos/" | "/api" | "/api/" | "/api/logos" | "/api/logos/" | `/api/logos/${string}` & {} | `/api/logos/${string}/` & {} | "/api/scan" | "/api/scan/" | "/deployments" | "/deployments/" | "/ecosystem" | "/ecosystem/" | "/login" | "/login/" | "/logout" | "/logout/" | "/projects" | "/projects/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.svg" | "/icons/apple-touch-icon.png" | "/icons/icon-192.png" | "/icons/icon-512.png" | "/icons/icon-maskable-512.png" | "/logo.svg" | "/manifest.json" | "/robots.txt" | "/sw.js" | string & {};
	}
}