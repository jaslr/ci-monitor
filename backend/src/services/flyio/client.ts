import { env } from '../../config/env.js';

const FLY_GRAPHQL_URL = 'https://api.fly.io/graphql';

const APPS_QUERY = `
  query GetApps {
    apps {
      nodes {
        id
        name
        status
        deployed
        hostname
        currentRelease {
          id
          status
          createdAt
        }
        machines {
          nodes {
            id
            name
            state
            region
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`;

export interface FlyApp {
  id: string;
  name: string;
  status: string;
  deployed: boolean;
  hostname: string;
  currentRelease?: {
    id: string;
    status: string;
    createdAt: string;
  };
  machines: {
    nodes: FlyMachine[];
  };
}

export interface FlyMachine {
  id: string;
  name: string;
  state: 'created' | 'starting' | 'started' | 'stopping' | 'stopped' | 'destroying' | 'destroyed';
  region: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchFlyApps(): Promise<FlyApp[]> {
  if (!env.flyApiToken) {
    console.warn('FLY_API_TOKEN not set, skipping Fly.io polling');
    return [];
  }

  try {
    const response = await fetch(FLY_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.flyApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: APPS_QUERY }),
    });

    if (!response.ok) {
      throw new Error(`Fly.io API error: ${response.status}`);
    }

    const data = (await response.json()) as {
      data?: { apps?: { nodes?: FlyApp[] } };
      errors?: unknown[];
    };

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    return data.data?.apps?.nodes || [];
  } catch (err) {
    console.error('Failed to fetch Fly.io apps:', err);
    return [];
  }
}

export function mapFlyStatusToHealth(
  app: FlyApp
): 'healthy' | 'degraded' | 'down' | 'unknown' {
  if (!app.deployed) {
    return 'down';
  }

  const machines = app.machines.nodes;
  if (machines.length === 0) {
    return 'unknown';
  }

  const runningMachines = machines.filter((m) => m.state === 'started');
  const totalMachines = machines.length;

  if (runningMachines.length === 0) {
    return 'down';
  }

  if (runningMachines.length < totalMachines) {
    return 'degraded';
  }

  return 'healthy';
}
