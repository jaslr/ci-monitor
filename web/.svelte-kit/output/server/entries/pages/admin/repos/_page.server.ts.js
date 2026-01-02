import { fail } from "@sveltejs/kit";
import { r as repos, o as ownerPATEnvVar } from "../../../../chunks/repos.js";
import { I as INFRASTRUCTURE } from "../../../../chunks/infrastructure.js";
import { b as private_env } from "../../../../chunks/shared-server.js";
function detectTechStack(pkg) {
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const depNames = Object.keys(deps);
  const stack = {
    framework: null,
    language: "javascript",
    css: [],
    testing: [],
    buildTool: null,
    packageManager: "npm",
    icons: null
  };
  if (depNames.includes("typescript") || depNames.includes("@types/node")) {
    stack.language = "typescript";
  }
  if (depNames.includes("@sveltejs/kit")) stack.framework = "sveltekit";
  else if (depNames.includes("svelte")) stack.framework = "svelte";
  else if (depNames.includes("next")) stack.framework = "next";
  else if (depNames.includes("nuxt")) stack.framework = "nuxt";
  else if (depNames.includes("@angular/core")) stack.framework = "angular";
  else if (depNames.includes("react")) stack.framework = "react";
  else if (depNames.includes("vue")) stack.framework = "vue";
  else if (depNames.includes("express")) stack.framework = "express";
  else if (depNames.includes("hono")) stack.framework = "hono";
  else if (depNames.includes("fastify")) stack.framework = "fastify";
  if (depNames.includes("tailwindcss")) stack.css.push("tailwind");
  if (depNames.includes("@skeletonlabs/skeleton")) stack.css.push("skeleton");
  if (depNames.includes("sass") || depNames.includes("node-sass")) stack.css.push("sass");
  if (depNames.includes("styled-components")) stack.css.push("styled-components");
  if (depNames.includes("@playwright/test") || depNames.includes("playwright")) stack.testing.push("playwright");
  if (depNames.includes("vitest")) stack.testing.push("vitest");
  if (depNames.includes("jest")) stack.testing.push("jest");
  if (depNames.includes("cypress")) stack.testing.push("cypress");
  if (depNames.includes("vite")) stack.buildTool = "vite";
  else if (depNames.includes("webpack")) stack.buildTool = "webpack";
  else if (depNames.includes("esbuild")) stack.buildTool = "esbuild";
  else if (depNames.includes("rollup")) stack.buildTool = "rollup";
  if (depNames.includes("lucide-svelte") || depNames.includes("@lucide/svelte")) stack.icons = "lucide";
  else if (depNames.includes("@heroicons/react") || depNames.includes("heroicons")) stack.icons = "heroicons";
  else if (depNames.includes("@fortawesome/fontawesome-free")) stack.icons = "fontawesome";
  return stack;
}
async function fetchRepoInfo(owner, repo, pat) {
  const defaultInfo = {
    lastPush: null,
    defaultBranch: null,
    hasGitHubActions: false,
    deploymentMethod: "unknown",
    workflowFiles: []
  };
  try {
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        "Authorization": `Bearer ${pat}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "ci-monitor"
      }
    });
    if (repoResponse.ok) {
      const repoData = await repoResponse.json();
      defaultInfo.lastPush = repoData.pushed_at;
      defaultInfo.defaultBranch = repoData.default_branch;
    }
    const workflowsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/.github/workflows`, {
      headers: {
        "Authorization": `Bearer ${pat}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "ci-monitor"
      }
    });
    if (workflowsResponse.ok) {
      const files = await workflowsResponse.json();
      if (Array.isArray(files)) {
        defaultInfo.workflowFiles = files.filter((f) => f.name.endsWith(".yml") || f.name.endsWith(".yaml")).map((f) => f.name);
        defaultInfo.hasGitHubActions = defaultInfo.workflowFiles.length > 0;
        const deployWorkflows = defaultInfo.workflowFiles.filter(
          (f) => f.toLowerCase().includes("deploy") || f.toLowerCase().includes("release") || f.toLowerCase().includes("publish")
        );
        defaultInfo.deploymentMethod = deployWorkflows.length > 0 ? "github-actions" : "forked";
      }
    } else {
      defaultInfo.deploymentMethod = "forked";
    }
    return defaultInfo;
  } catch (err) {
    console.warn(`Error fetching repo info for ${owner}/${repo}:`, err);
    return defaultInfo;
  }
}
async function fetchPackageJson(owner, repo, pat) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, {
      headers: {
        "Authorization": `Bearer ${pat}`,
        "Accept": "application/vnd.github.v3.raw",
        "User-Agent": "ci-monitor"
      }
    });
    if (!response.ok) {
      console.warn(`Failed to fetch package.json for ${owner}/${repo}: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (err) {
    console.warn(`Error fetching package.json for ${owner}/${repo}:`, err);
    return null;
  }
}
const load = async ({ url }) => {
  const selectedProject = url.searchParams.get("project");
  const projects = [];
  for (const [owner, repoList] of Object.entries(repos)) {
    const patEnvVar = ownerPATEnvVar[owner];
    const pat = private_env[patEnvVar];
    for (const repo of repoList) {
      const infraConfig = INFRASTRUCTURE[repo] || null;
      let packageJson = null;
      let detectedStack = null;
      let repoInfo = null;
      if (pat && selectedProject === repo) {
        const [fetchedRepoInfo, fetchedPackageJson] = await Promise.all([
          fetchRepoInfo(owner, repo, pat),
          fetchPackageJson(owner, repo, pat)
        ]);
        repoInfo = fetchedRepoInfo;
        packageJson = fetchedPackageJson;
        if (packageJson) {
          detectedStack = detectTechStack(packageJson);
        }
      }
      projects.push({
        owner,
        repo,
        infraConfig,
        detectedStack,
        packageJson,
        repoInfo
      });
    }
  }
  return {
    projects,
    selectedProject,
    configFilePath: "src/lib/config/infrastructure.ts",
    reposFilePath: "src/lib/config/repos.ts"
  };
};
async function checkPackageVersion(name, currentVersion) {
  try {
    const response = await fetch(`https://registry.npmjs.org/${name}/latest`, {
      headers: { "Accept": "application/json" }
    });
    if (!response.ok) {
      return { name, current: currentVersion, latest: "unknown", isOutdated: false, majorBehind: 0 };
    }
    const data = await response.json();
    const latest = data.version || "unknown";
    const cleanCurrent = currentVersion.replace(/^[\^~]/, "");
    const currentParts = cleanCurrent.split(".").map((p) => parseInt(p) || 0);
    const latestParts = latest.split(".").map((p) => parseInt(p) || 0);
    const majorBehind = latestParts[0] - currentParts[0];
    const isOutdated = majorBehind > 0 || majorBehind === 0 && latestParts[1] > currentParts[1] || majorBehind === 0 && latestParts[1] === currentParts[1] && latestParts[2] > currentParts[2];
    return { name, current: cleanCurrent, latest, isOutdated, majorBehind };
  } catch {
    return { name, current: currentVersion, latest: "error", isOutdated: false, majorBehind: 0 };
  }
}
const actions = {
  // Scan a specific repo's package.json
  scanRepo: async ({ request }) => {
    const formData = await request.formData();
    const owner = formData.get("owner");
    const repo = formData.get("repo");
    if (!owner || !repo) {
      return fail(400, { error: "Missing owner or repo" });
    }
    const patEnvVar = ownerPATEnvVar[owner];
    const pat = private_env[patEnvVar];
    if (!pat) {
      return fail(400, { error: `No PAT configured for ${owner}` });
    }
    const packageJson = await fetchPackageJson(owner, repo, pat);
    if (!packageJson) {
      return fail(404, { error: `Could not fetch package.json for ${owner}/${repo}` });
    }
    const detectedStack = detectTechStack(packageJson);
    return {
      success: true,
      repo,
      detectedStack,
      packageJson
    };
  },
  // Check for outdated packages
  checkOutdated: async ({ request }) => {
    const formData = await request.formData();
    const packagesJson = formData.get("packages");
    if (!packagesJson) {
      return fail(400, { error: "Missing packages data" });
    }
    try {
      const packages = JSON.parse(packagesJson);
      const packageNames = Object.keys(packages);
      const keyPackages = packageNames.slice(0, 10);
      const results = await Promise.all(
        keyPackages.map((name) => checkPackageVersion(name, packages[name]))
      );
      const outdated = results.filter((r) => r.isOutdated);
      const majorOutdated = results.filter((r) => r.majorBehind > 0);
      return {
        action: "checkOutdated",
        success: true,
        results,
        summary: {
          checked: results.length,
          outdated: outdated.length,
          majorOutdated: majorOutdated.length
        }
      };
    } catch (err) {
      return fail(400, { error: "Invalid packages data" });
    }
  }
};
export {
  actions,
  load
};
