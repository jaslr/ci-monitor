/**
 * Project Scan API
 *
 * GET /api/scan - Scan all known projects
 * GET /api/scan?project=livna - Scan specific project
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { scanProject, scanAllProjects, KNOWN_PROJECTS, buildProject } from '$lib/services/project-scanner';

export const GET: RequestHandler = async ({ url }) => {
  const projectId = url.searchParams.get('project');

  try {
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
