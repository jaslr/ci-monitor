const BACKEND_URL = "https://observatory-backend.fly.dev";
const load = async ({ locals, url }) => {
  const apiSecret = locals.apiSecret;
  const authHeaders = apiSecret ? { "Authorization": `Bearer ${apiSecret}` } : {};
  const projectFilter = url.searchParams.get("project");
  let deployments = [];
  try {
    const response = await fetch(`${BACKEND_URL}/api/deployments/recent?limit=100`, {
      headers: authHeaders
    });
    if (response.ok) {
      const data = await response.json();
      deployments = data.deployments || [];
    }
  } catch (err) {
    console.warn("Failed to fetch deployments:", err);
  }
  const projects = [...new Map(
    deployments.map((d) => [d.projectName, { id: d.projectName, name: d.projectDisplayName || d.projectName }])
  ).values()].sort((a, b) => a.name.localeCompare(b.name));
  return {
    deployments,
    projects,
    projectFilter,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
  };
};
export {
  load
};
