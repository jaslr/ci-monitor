import { error } from "@sveltejs/kit";
const GET = async ({ params, platform }) => {
  const bucket = platform?.env?.LOGOS_BUCKET;
  if (!bucket) {
    throw error(500, "R2 bucket not configured");
  }
  const path = params.path;
  if (!path) {
    throw error(400, "No path specified");
  }
  try {
    const object = await bucket.get(path);
    if (!object) {
      throw error(404, "Logo not found");
    }
    let contentType = "application/octet-stream";
    if (path.endsWith(".svg")) {
      contentType = "image/svg+xml";
    } else if (path.endsWith(".png")) {
      contentType = "image/png";
    }
    return new Response(object.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch (err) {
    if (err.status) {
      throw err;
    }
    console.error("Failed to fetch logo:", err);
    throw error(500, "Failed to fetch logo");
  }
};
export {
  GET
};
