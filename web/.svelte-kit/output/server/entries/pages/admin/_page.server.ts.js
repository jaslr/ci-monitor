import { redirect } from "@sveltejs/kit";
const load = async () => {
  throw redirect(302, "/admin/media");
};
export {
  load
};
