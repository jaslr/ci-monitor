import * as server from '../entries/pages/projects/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/projects/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/projects/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.27Yt0Jtj.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/jd5WV0Du.js","_app/immutable/chunks/GwumCs-T.js","_app/immutable/chunks/CFL_xKr-.js","_app/immutable/chunks/B126N6VV.js","_app/immutable/chunks/CPgivW-j.js","_app/immutable/chunks/DaAn4gK4.js","_app/immutable/chunks/BRMV21nc.js","_app/immutable/chunks/CboUCRFK.js","_app/immutable/chunks/BxoKAY7i.js","_app/immutable/chunks/Dnr1q622.js","_app/immutable/chunks/CugbxRx9.js","_app/immutable/chunks/BLtbU3fE.js","_app/immutable/chunks/BL3PLj43.js","_app/immutable/chunks/BJKkoUms.js","_app/immutable/chunks/BMP4Ns62.js","_app/immutable/chunks/BHUtcvQq.js","_app/immutable/chunks/BJh6O_k9.js","_app/immutable/chunks/IP838Ow-.js","_app/immutable/chunks/BF1P7oF9.js","_app/immutable/chunks/DWhUD91g.js"];
export const stylesheets = ["_app/immutable/assets/12.CXPR0kzH.css"];
export const fonts = [];
