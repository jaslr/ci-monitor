import { Hono } from 'hono';
import * as db from '../db/queries.js';

export const apiRoutes = new Hono();

// =============================================================================
// Project endpoints (now database-driven)
// =============================================================================

// List all projects with current status
apiRoutes.get('/projects', async (c) => {
  try {
    const [projects, statuses] = await Promise.all([
      db.getAllProjects(),
      db.getLatestStatusForAllProjects(),
    ]);

    const projectsWithStatus = await Promise.all(
      projects.map(async (project) => {
        const services = await db.getServicesByProject(project.id);
        return {
          ...project,
          services,
          currentStatus: statuses.find((s) => s.projectId === project.id) || null,
        };
      })
    );

    return c.json({ projects: projectsWithStatus });
  } catch (err) {
    console.error('Error fetching projects:', err);
    return c.json({ error: 'Failed to fetch projects' }, 500);
  }
});

// Get single project details
apiRoutes.get('/projects/:id', async (c) => {
  const projectId = c.req.param('id');

  try {
    const project = await db.getProjectById(projectId);

    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }

    const [services, status, recentDeployments, uptimeHistory] = await Promise.all([
      db.getServicesByProject(projectId),
      db.getLatestStatus(projectId),
      db.getRecentDeployments(projectId, 10),
      db.getUptimeHistory(projectId, 24),
    ]);

    return c.json({
      project: { ...project, services },
      status,
      recentDeployments,
      uptimeHistory,
    });
  } catch (err) {
    console.error(`Error fetching project ${projectId}:`, err);
    return c.json({ error: 'Failed to fetch project' }, 500);
  }
});

// Create a new project
apiRoutes.post('/projects', async (c) => {
  try {
    const body = await c.req.json();
    const { id, name, displayName, owner, alertLevel, alertEmail, uptimeUrl, productionUrl, repoName, deployMechanism, services } = body;

    if (!id || !name || !displayName || !owner) {
      return c.json({ error: 'Missing required fields: id, name, displayName, owner' }, 400);
    }

    // Check if project already exists
    const existing = await db.getProjectById(id);
    if (existing) {
      return c.json({ error: 'Project with this ID already exists' }, 409);
    }

    const project = await db.createProject({
      id,
      name,
      displayName,
      owner,
      alertLevel,
      alertEmail,
      uptimeUrl,
      productionUrl,
      repoName,
      deployMechanism,
    });

    // Create services if provided
    const createdServices: db.ServiceRow[] = [];
    if (services && Array.isArray(services)) {
      for (const svc of services) {
        const service = await db.createService({
          id: svc.id || `${id}-${svc.category}`,
          projectId: id,
          category: svc.category,
          provider: svc.provider,
          serviceName: svc.serviceName,
          checkUrl: svc.checkUrl,
          dashboardUrl: svc.dashboardUrl,
          config: svc.config,
        });
        createdServices.push(service);
      }
    }

    return c.json({ project: { ...project, services: createdServices } }, 201);
  } catch (err) {
    console.error('Error creating project:', err);
    return c.json({ error: 'Failed to create project' }, 500);
  }
});

// Update a project
apiRoutes.put('/projects/:id', async (c) => {
  const projectId = c.req.param('id');

  try {
    const body = await c.req.json();
    const { name, displayName, owner, alertLevel, alertEmail, uptimeUrl, productionUrl, repoName, deployMechanism } = body;

    const project = await db.updateProject(projectId, {
      name,
      displayName,
      owner,
      alertLevel,
      alertEmail,
      uptimeUrl,
      productionUrl,
      repoName,
      deployMechanism,
    });

    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }

    const services = await db.getServicesByProject(projectId);
    return c.json({ project: { ...project, services } });
  } catch (err) {
    console.error(`Error updating project ${projectId}:`, err);
    return c.json({ error: 'Failed to update project' }, 500);
  }
});

// Delete a project
apiRoutes.delete('/projects/:id', async (c) => {
  const projectId = c.req.param('id');

  try {
    const deleted = await db.deleteProject(projectId);

    if (!deleted) {
      return c.json({ error: 'Project not found' }, 404);
    }

    return c.json({ message: 'Project deleted' });
  } catch (err) {
    console.error(`Error deleting project ${projectId}:`, err);
    return c.json({ error: 'Failed to delete project' }, 500);
  }
});

// =============================================================================
// Service endpoints
// =============================================================================

// Add service to project
apiRoutes.post('/projects/:id/services', async (c) => {
  const projectId = c.req.param('id');

  try {
    const project = await db.getProjectById(projectId);
    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }

    const body = await c.req.json();
    const { id, category, provider, serviceName, checkUrl, dashboardUrl, config } = body;

    if (!category || !provider || !serviceName) {
      return c.json({ error: 'Missing required fields: category, provider, serviceName' }, 400);
    }

    const service = await db.createService({
      id: id || `${projectId}-${category}-${provider}`,
      projectId,
      category,
      provider,
      serviceName,
      checkUrl,
      dashboardUrl,
      config,
    });

    return c.json({ service }, 201);
  } catch (err) {
    console.error(`Error creating service for ${projectId}:`, err);
    return c.json({ error: 'Failed to create service' }, 500);
  }
});

// Update a service
apiRoutes.put('/services/:id', async (c) => {
  const serviceId = c.req.param('id');

  try {
    const body = await c.req.json();
    const { category, provider, serviceName, checkUrl, dashboardUrl, config } = body;

    const service = await db.updateService(serviceId, {
      category,
      provider,
      serviceName,
      checkUrl,
      dashboardUrl,
      config,
    });

    if (!service) {
      return c.json({ error: 'Service not found' }, 404);
    }

    return c.json({ service });
  } catch (err) {
    console.error(`Error updating service ${serviceId}:`, err);
    return c.json({ error: 'Failed to update service' }, 500);
  }
});

// Delete a service
apiRoutes.delete('/services/:id', async (c) => {
  const serviceId = c.req.param('id');

  try {
    const deleted = await db.deleteService(serviceId);

    if (!deleted) {
      return c.json({ error: 'Service not found' }, 404);
    }

    return c.json({ message: 'Service deleted' });
  } catch (err) {
    console.error(`Error deleting service ${serviceId}:`, err);
    return c.json({ error: 'Failed to delete service' }, 500);
  }
});

// Trigger manual status check for a project
apiRoutes.post('/projects/:id/check', async (c) => {
  const projectId = c.req.param('id');

  try {
    const project = await db.getProjectById(projectId);

    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }

    // TODO: Trigger immediate checks for all services
    return c.json({ message: 'Check triggered', projectId });
  } catch (err) {
    console.error(`Error checking project ${projectId}:`, err);
    return c.json({ error: 'Failed to check project' }, 500);
  }
});

// Get status history for a project
apiRoutes.get('/projects/:id/history', async (c) => {
  const projectId = c.req.param('id');
  const hours = parseInt(c.req.query('hours') || '24', 10);

  try {
    const history = await db.getStatusHistory(projectId, hours);
    return c.json({ history });
  } catch (err) {
    console.error(`Error fetching history for ${projectId}:`, err);
    return c.json({ error: 'Failed to fetch history' }, 500);
  }
});

// Cost tracking endpoints
apiRoutes.get('/costs', async (c) => {
  try {
    const costs = await db.getAllCosts();
    return c.json({ costs });
  } catch (err) {
    console.error('Error fetching costs:', err);
    return c.json({ error: 'Failed to fetch costs' }, 500);
  }
});

apiRoutes.post('/costs', async (c) => {
  try {
    const body = await c.req.json();
    const { projectId, month, amountCents, provider, notes } = body;

    if (!projectId || !month || amountCents === undefined || !provider) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const cost = await db.insertCost({ projectId, month, amountCents, provider, notes });
    return c.json({ cost }, 201);
  } catch (err) {
    console.error('Error creating cost entry:', err);
    return c.json({ error: 'Failed to create cost entry' }, 500);
  }
});
