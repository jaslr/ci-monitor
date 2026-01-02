/**
 * Project Scan API
 *
 * GET /api/scan - Scan all known projects
 * GET /api/scan?project=livna - Scan specific project
 *
 * Note: Filesystem scanning only works locally, not on Cloudflare edge.
 * In production, this returns a message indicating scanning is local-only.
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dev } from '$app/environment';

export const GET: RequestHandler = async ({ url }) => {
  // Filesystem scanning only works in dev mode (local)
  if (!dev) {
    return json({
      message: 'Infrastructure scanning is only available locally',
      reason: 'Cloudflare edge runtime does not have filesystem access',
      suggestion: 'Run npm run dev locally to scan projects'
    }, { status: 200 });
  }

  const projectId = url.searchParams.get('project');

  try {
    // Dynamic import to avoid bundling Node.js modules in edge build
    const { scanProject, scanAllProjects, KNOWN_PROJECTS, buildProject } =
      await import('$lib/services/project-scanner');

    if (projectId) {
      // Scan specific project
      const info = KNOWN_PROJECTS[projectId];
      if (!info) {
        return json({ error: `Unknown project: ${projectId}` }, { status: 404 });
      }

      const result = await scanProject(info.path, projectId);
      const project = buildProject(projectId, result);

      return json({
        project,
        discovery: result,
      });
    } else {
      // Scan all projects
      const results = await scanAllProjects();
      const projects = [];

      for (const [id, result] of results) {
        projects.push({
          project: buildProject(id, result),
          discovery: result,
        });
      }

      return json({ projects });
    }
  } catch (e) {
    console.error('Scan failed:', e);
    return json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
};
