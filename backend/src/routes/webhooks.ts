import { Hono } from 'hono';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { handleWorkflowRun } from '../services/github/webhook-handler.js';
import { broadcast } from '../sse/broadcaster.js';
import { dispatchAlert } from '../services/alerts/dispatcher.js';

export const webhookRoutes = new Hono();

// GitHub webhook endpoint
webhookRoutes.post('/github', async (c) => {
  const signature = c.req.header('X-Hub-Signature-256');
  const event = c.req.header('X-GitHub-Event');
  const deliveryId = c.req.header('X-GitHub-Delivery');

  if (!signature) {
    return c.json({ error: 'Missing signature' }, 401);
  }

  const body = await c.req.text();

  // Validate HMAC signature
  const expectedSignature =
    'sha256=' + crypto.createHmac('sha256', env.githubWebhookSecret).update(body).digest('hex');

  try {
    if (
      !crypto.timingSafeEqual(Buffer.from(signature, 'utf8'), Buffer.from(expectedSignature, 'utf8'))
    ) {
      console.warn(`Invalid webhook signature for delivery ${deliveryId}`);
      return c.json({ error: 'Invalid signature' }, 401);
    }
  } catch {
    return c.json({ error: 'Invalid signature format' }, 401);
  }

  console.log(`Received GitHub webhook: ${event} (${deliveryId})`);

  // Only handle workflow_run events
  if (event !== 'workflow_run') {
    return c.json({ message: `Ignored event type: ${event}` }, 200);
  }

  try {
    const payload = JSON.parse(body);
    const result = await handleWorkflowRun(payload);

    if (result) {
      // Broadcast to all SSE clients
      broadcast({
        type: 'deployment',
        project: result.projectId,
        data: result,
      });

      // Check if alert needed
      if (result.status === 'failure') {
        await dispatchAlert(result.projectId, result.serviceId, 'deploy_failure',
          `Workflow "${result.workflowName}" failed on ${result.projectId}`);
      }

      console.log(`Processed workflow_run: ${result.projectId} - ${result.status}`);
    }

    return c.json({ received: true, processed: !!result });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return c.json({ error: 'Processing failed' }, 500);
  }
});
