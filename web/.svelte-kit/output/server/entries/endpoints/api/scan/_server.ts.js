import { json } from "@sveltejs/kit";
const GET = async ({ url }) => {
  {
    return json({
      message: "Infrastructure scanning is only available locally",
      reason: "Cloudflare edge runtime does not have filesystem access",
      suggestion: "Run npm run dev locally to scan projects"
    }, { status: 200 });
  }
};
export {
  GET
};
