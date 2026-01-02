import { redirect } from "@sveltejs/kit";
import { g as getSessionCookie } from "../../../chunks/auth.js";
const actions = {
  default: async ({ cookies }) => {
    const { name, options } = getSessionCookie();
    cookies.get(name);
    cookies.delete(name, { path: options.path });
    throw redirect(303, "/login");
  }
};
export {
  actions
};
