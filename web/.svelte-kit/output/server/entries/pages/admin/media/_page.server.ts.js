import { fail } from "@sveltejs/kit";
const LOGOS_API_PREFIX = "/api/logos";
const load = async ({ platform }) => {
  const bucket = platform?.env?.LOGOS_BUCKET;
  if (!bucket) {
    console.warn("R2 bucket not configured");
    return { logos: [] };
  }
  try {
    const listed = await bucket.list();
    const logos = [];
    for (const obj of listed.objects) {
      const parts = obj.key.split("/");
      const type = parts[0];
      const filename = parts.slice(1).join("/");
      const name = filename.replace(/\.(svg|png)$/i, "");
      logos.push({
        id: obj.key,
        name,
        url: `${LOGOS_API_PREFIX}/${obj.key}`,
        type
      });
    }
    return { logos };
  } catch (err) {
    console.error("Failed to list logos from R2:", err);
    return { logos: [] };
  }
};
const actions = {
  uploadLogo: async ({ request, platform }) => {
    const bucket = platform?.env?.LOGOS_BUCKET;
    if (!bucket) {
      return fail(500, { error: "R2 bucket not configured" });
    }
    const formData = await request.formData();
    const file = formData.get("logo");
    const type = formData.get("type");
    if (!file || file.size === 0) {
      return fail(400, { error: "No file selected" });
    }
    const validTypes = ["image/svg+xml", "image/png"];
    if (!validTypes.includes(file.type)) {
      return fail(400, { error: "Invalid file type. Only SVG and PNG are allowed." });
    }
    if (file.size > 1024 * 1024) {
      return fail(400, { error: "File too large. Maximum size is 1MB." });
    }
    try {
      const ext = file.type === "image/svg+xml" ? "svg" : "png";
      const providedFilename = formData.get("filename");
      const baseName = providedFilename || file.name.replace(/\.(svg|png)$/i, "").replace(/[^a-zA-Z0-9-_]/g, "-");
      const key = `${type}/${baseName}.${ext}`;
      const arrayBuffer = await file.arrayBuffer();
      await bucket.put(key, arrayBuffer, {
        httpMetadata: {
          contentType: file.type
        }
      });
      return { success: true, message: `Logo "${baseName}" uploaded successfully!` };
    } catch (err) {
      console.error("Failed to upload to R2:", err);
      return fail(500, { error: "Failed to upload logo" });
    }
  },
  deleteLogo: async ({ request, platform }) => {
    const bucket = platform?.env?.LOGOS_BUCKET;
    if (!bucket) {
      return fail(500, { error: "R2 bucket not configured" });
    }
    const formData = await request.formData();
    const logoId = formData.get("logoId");
    if (!logoId) {
      return fail(400, { error: "No logo ID provided" });
    }
    try {
      await bucket.delete(logoId);
      const name = logoId.split("/").pop()?.replace(/\.(svg|png)$/i, "") || logoId;
      return { success: true, message: `Logo "${name}" deleted.` };
    } catch (err) {
      console.error("Failed to delete from R2:", err);
      return fail(500, { error: "Failed to delete logo" });
    }
  }
};
export {
  actions,
  load
};
