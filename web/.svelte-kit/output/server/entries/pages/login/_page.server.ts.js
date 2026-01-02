import { fail, redirect } from "@sveltejs/kit";
import { v as verifyCredentials, c as createSession, g as getSessionCookie } from "../../../chunks/auth.js";
const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get("username");
    const password = data.get("password");
    if (!username || typeof username !== "string") {
      return fail(400, { error: "Email is required" });
    }
    if (!password || typeof password !== "string") {
      return fail(400, { error: "Password is required" });
    }
    if (!verifyCredentials(username, password)) {
      return fail(401, { error: "Invalid credentials" });
    }
    const sessionToken = createSession();
    const { name, options } = getSessionCookie();
    cookies.set(name, sessionToken, options);
    throw redirect(303, "/");
  }
};
export {
  actions
};
