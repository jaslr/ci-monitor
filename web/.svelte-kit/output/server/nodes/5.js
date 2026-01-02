import * as server from '../entries/pages/admin/media/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/media/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/media/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.74PI5UL5.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/jd5WV0Du.js","_app/immutable/chunks/GwumCs-T.js","_app/immutable/chunks/CFL_xKr-.js","_app/immutable/chunks/B126N6VV.js","_app/immutable/chunks/CPgivW-j.js","_app/immutable/chunks/DZ5SkXKy.js","_app/immutable/chunks/Dnr1q622.js","_app/immutable/chunks/CugbxRx9.js","_app/immutable/chunks/BJh6O_k9.js","_app/immutable/chunks/B4Y-hBWa.js","_app/immutable/chunks/B4o4KnKK.js","_app/immutable/chunks/V3H6yN6T.js","_app/immutable/chunks/BF1P7oF9.js"];
export const stylesheets = [];
export const fonts = [];
