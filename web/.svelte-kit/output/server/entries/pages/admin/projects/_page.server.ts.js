import { fail } from "@sveltejs/kit";
import { r as repos } from "../../../../chunks/repos.js";
const DEFAULT_GROUPS = [
  { id: "jaslr", name: "JASLR", color: "#3b82f6" },
  { id: "jvp-ux", name: "JVP-UX", color: "#8b5cf6" },
  { id: "junipa", name: "Junipa", color: "#10b981" }
];
const load = async ({ cookies }) => {
  const savedConfig = cookies.get("project_config");
  let projectConfig;
  if (savedConfig) {
    try {
      projectConfig = JSON.parse(savedConfig);
    } catch {
      projectConfig = buildDefaultConfig();
    }
  } else {
    projectConfig = buildDefaultConfig();
  }
  return {
    groups: projectConfig.groups,
    projects: projectConfig.projects
  };
};
function buildDefaultConfig() {
  const projects = [];
  let order = 0;
  for (const [owner, repoList] of Object.entries(repos)) {
    for (const repo of repoList) {
      const groups = [owner];
      if (repo.toLowerCase().includes("junipa")) {
        groups.push("junipa");
      }
      projects.push({
        id: `${owner}/${repo}`,
        owner,
        repo,
        displayName: repo,
        groups,
        order: order++
      });
    }
  }
  return {
    groups: DEFAULT_GROUPS,
    projects
  };
}
const actions = {
  // Save project configuration
  saveConfig: async ({ request, cookies }) => {
    const formData = await request.formData();
    const configJson = formData.get("config");
    if (!configJson) {
      return fail(400, { error: "No config provided" });
    }
    try {
      const config = JSON.parse(configJson);
      if (!config.groups || !config.projects) {
        return fail(400, { error: "Invalid config structure" });
      }
      cookies.set("project_config", configJson, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365
        // 1 year
      });
      return { success: true, message: "Configuration saved!" };
    } catch (err) {
      return fail(400, { error: "Invalid JSON" });
    }
  },
  // Reset to defaults
  resetConfig: async ({ cookies }) => {
    cookies.delete("project_config", { path: "/" });
    return { success: true, message: "Reset to defaults!" };
  },
  // Add a new group
  addGroup: async ({ request, cookies }) => {
    const formData = await request.formData();
    const name = formData.get("name");
    const color = formData.get("color") || "#6b7280";
    if (!name) {
      return fail(400, { error: "Group name is required" });
    }
    const savedConfig = cookies.get("project_config");
    const config = savedConfig ? JSON.parse(savedConfig) : buildDefaultConfig();
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    if (config.groups.some((g) => g.id === id)) {
      return fail(400, { error: "Group already exists" });
    }
    config.groups.push({ id, name, color });
    cookies.set("project_config", JSON.stringify(config), {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365
    });
    return { success: true, message: `Group "${name}" created!` };
  },
  // Delete a group
  deleteGroup: async ({ request, cookies }) => {
    const formData = await request.formData();
    const groupId = formData.get("groupId");
    if (!groupId) {
      return fail(400, { error: "Group ID is required" });
    }
    const savedConfig = cookies.get("project_config");
    const config = savedConfig ? JSON.parse(savedConfig) : buildDefaultConfig();
    config.groups = config.groups.filter((g) => g.id !== groupId);
    for (const project of config.projects) {
      project.groups = project.groups.filter((g) => g !== groupId);
    }
    cookies.set("project_config", JSON.stringify(config), {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365
    });
    return { success: true, message: "Group deleted!" };
  }
};
export {
  actions,
  load
};
