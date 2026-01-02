import * as server from '../entries/pages/admin/projects/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/projects/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/projects/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.DD9bcNlh.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/jd5WV0Du.js","_app/immutable/chunks/GwumCs-T.js","_app/immutable/chunks/CFL_xKr-.js","_app/immutable/chunks/B126N6VV.js","_app/immutable/chunks/CPgivW-j.js","_app/immutable/chunks/DZ5SkXKy.js","_app/immutable/chunks/Dnr1q622.js","_app/immutable/chunks/CugbxRx9.js","_app/immutable/chunks/C7CnG3Gw.js","_app/immutable/chunks/B4Y-hBWa.js","_app/immutable/chunks/B4o4KnKK.js","_app/immutable/chunks/BMP4Ns62.js","_app/immutable/chunks/m-L5ZLk5.js","_app/immutable/chunks/V3H6yN6T.js"];
export const stylesheets = [];
export const fonts = [];
