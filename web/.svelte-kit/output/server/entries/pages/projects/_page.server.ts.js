import { r as repos, o as ownerPATEnvVar } from "../../../chunks/repos.js";
import { g as getLatestWorkflowRun } from "../../../chunks/github.js";
import { g as getProjectInfrastructure } from "../../../chunks/infrastructure.js";
import { b as private_env } from "../../../chunks/shared-server.js";
const BACKEND_URL = "https://observatory-backend.fly.dev";
function mapBackendStatus(status) {
  switch (status) {
    case "healthy":
      return "success";
    case "degraded":
    case "deploying":
      return "deploying";
    case "down":
    case "unhealthy":
      return "failure";
    default:
      return "unknown";
  }
}
function getHostingPlatform(project) {
  const hostingService = project.services.find((s) => s.category === "hosting");
  if (!hostingService) return "local";
  switch (hostingService.provider) {
    case "cloudflare":
      return "cloudflare";
    case "flyio":
      return "flyio";
    case "vercel":
      return "vercel";
    case "netlify":
      return "netlify";
    default:
      return "local";
  }
}
const load = async ({ locals }) => {
  const statuses = [];
  let backendProjects = [];
  try {
    const apiSecret = locals.apiSecret;
    const response = await fetch(`${BACKEND_URL}/api/projects`, {
      headers: apiSecret ? { "Authorization": `Bearer ${apiSecret}` } : {}
    });
    if (response.ok) {
      const data = await response.json();
      backendProjects = data.projects || [];
    }
  } catch (err) {
    console.warn("Failed to fetch backend status:", err);
  }
  for (const [owner, repoList] of Object.entries(repos)) {
    const patEnvVar = ownerPATEnvVar[owner];
    const pat = private_env[patEnvVar];
    if (!pat) {
      console.warn(`Missing PAT for ${owner}: ${patEnvVar}`);
      for (const repo of repoList) {
        const backendProject = backendProjects.find(
          (p) => p.name.toLowerCase() === repo.toLowerCase() || p.id.toLowerCase() === repo.toLowerCase()
        );
        statuses.push({
          owner,
          repo,
          // Deployment status from backend
          deployStatus: mapBackendStatus(backendProject?.currentStatus?.status),
          deployPlatform: backendProject ? getHostingPlatform(backendProject) : "local",
          deployedAt: backendProject?.currentStatus?.checkedAt || null,
          deployUrl: null,
          // Git repo status
          version: null,
          lastPush: null,
          lastCommitSha: null,
          repoUrl: `https://github.com/${owner}/${repo}`,
          // Legacy CI status
          status: "unknown",
          conclusion: null,
          html_url: `https://github.com/${owner}/${repo}/actions`,
          workflow_name: null,
          run_date: null
        });
      }
      continue;
    }
    const repoStatuses = await Promise.all(
      repoList.map(async (repo) => {
        const gitStatus = await getLatestWorkflowRun(owner, repo, pat);
        const backendProject = backendProjects.find(
          (p) => p.name.toLowerCase() === repo.toLowerCase() || p.id.toLowerCase() === repo.toLowerCase()
        );
        const infra = getProjectInfrastructure(repo);
        const hostingService = infra?.services.find((s) => s.category === "hosting");
        let platform = "local";
        if (hostingService?.provider === "flyio") platform = "flyio";
        else if (hostingService?.provider === "cloudflare") platform = "cloudflare";
        else if (hostingService?.provider === "vercel") platform = "vercel";
        else if (hostingService?.provider === "netlify") platform = "netlify";
        else if (hostingService?.provider === "gcp" || hostingService?.provider === "firebase") platform = "gcp";
        if (backendProject?.currentStatus) {
          return {
            ...gitStatus,
            deployStatus: mapBackendStatus(backendProject.currentStatus.status),
            deployPlatform: getHostingPlatform(backendProject),
            deployedAt: backendProject.currentStatus.checkedAt
          };
        }
        const deployMechanism = infra?.deployMechanism;
        let deployStatus = "unknown";
        let deployedAt = null;
        if (deployMechanism === "github-actions") {
          const ciStatus = gitStatus.status;
          if (ciStatus === "success") deployStatus = "success";
          else if (ciStatus === "failure") deployStatus = "failure";
          else if (ciStatus === "in_progress") deployStatus = "deploying";
          deployedAt = gitStatus.run_date;
        }
        return {
          ...gitStatus,
          deployStatus,
          deployPlatform: platform,
          deployedAt
        };
      })
    );
    statuses.push(...repoStatuses);
  }
  const gitRepoIds = new Set(
    Object.entries(repos).flatMap(
      ([owner, repoList]) => repoList.map((repo) => repo.toLowerCase())
    )
  );
  for (const project of backendProjects) {
    if (gitRepoIds.has(project.name.toLowerCase()) || gitRepoIds.has(project.id.toLowerCase())) {
      continue;
    }
    const ciService = project.services.find((s) => s.category === "ci");
    if (ciService?.provider === "gcp" || ciService?.provider === "github") {
      const owner = project.id.startsWith("junipa") ? "jvp-ux" : "unknown";
      statuses.push({
        owner,
        repo: project.id,
        // Deployment status from backend
        deployStatus: mapBackendStatus(project.currentStatus?.status),
        deployPlatform: ciService?.provider === "gcp" ? "gcp" : getHostingPlatform(project),
        deployedAt: project.currentStatus?.checkedAt || null,
        deployUrl: null,
        // Git repo status - not applicable for GCP Source Repos
        version: null,
        lastPush: null,
        lastCommitSha: null,
        repoUrl: ciService?.provider === "gcp" ? `https://console.cloud.google.com/cloud-build/builds?project=${project.services.find((s) => s.category === "ci")?.provider === "gcp" ? project.id : ""}` : `https://github.com/${owner}/${project.name}`,
        // Legacy CI status - use backend status
        status: project.currentStatus?.status === "healthy" ? "success" : project.currentStatus?.status === "down" ? "failure" : "unknown",
        conclusion: project.currentStatus?.status || null,
        html_url: ciService?.provider === "gcp" ? `https://console.cloud.google.com/cloud-build/builds?project=${project.id}` : `https://github.com/${owner}/${project.name}/actions`,
        workflow_name: ciService?.provider === "gcp" ? "GCP Cloud Build" : null,
        run_date: project.currentStatus?.checkedAt || null
      });
    }
  }
  return {
    statuses,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
  };
};
export {
  load
};
