import { projects } from '../../config/projects.js';
import { broadcast } from '../../sse/broadcaster.js';
import * as db from '../../db/queries.js';
import { sendEmail } from './email.js';

export type AlertType = 'deploy_failure' | 'down' | 'degraded';

export async function dispatchAlert(
  projectId: string,
  serviceId: string | undefined,
  alertType: AlertType,
  message: string
): Promise<void> {
  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    console.error(`Unknown project for alert: ${projectId}`);
    return;
  }

  console.log(`Alert [${alertType}] for ${projectId}: ${message}`);

  // Always broadcast to UI
  broadcast({
    type: 'alert',
    project: projectId,
    data: {
      alertType,
      message,
      projectName: project.displayName,
      timestamp: new Date().toISOString(),
    },
  });

  // Store alert in database
  try {
    await db.insertAlert({
      projectId,
      serviceId,
      alertType,
      message,
      channel: 'ui',
    });
  } catch (err) {
    console.error('Failed to store alert:', err);
  }

  // Send email for business projects
  if (project.alertLevel === 'business' && project.alertEmail) {
    try {
      await sendEmail({
        to: project.alertEmail,
        subject: `[Observatory] ${formatAlertType(alertType)}: ${project.displayName}`,
        text: formatAlertEmail(project.displayName, alertType, message),
        html: formatAlertEmailHtml(project.displayName, alertType, message),
      });

      // Store email alert
      await db.insertAlert({
        projectId,
        serviceId,
        alertType,
        message,
        channel: 'email',
      });

      console.log(`Email alert sent to ${project.alertEmail}`);
    } catch (err) {
      console.error('Failed to send email alert:', err);
    }
  }
}

function formatAlertType(type: AlertType): string {
  switch (type) {
    case 'deploy_failure':
      return 'Deploy Failed';
    case 'down':
      return 'Service Down';
    case 'degraded':
      return 'Service Degraded';
    default:
      return 'Alert';
  }
}

function formatAlertEmail(projectName: string, alertType: AlertType, message: string): string {
  return `
Infrastructure Observatory Alert

Project: ${projectName}
Type: ${formatAlertType(alertType)}
Time: ${new Date().toISOString()}

${message}

---
Sent by Observatory Backend
  `.trim();
}

function formatAlertEmailHtml(
  projectName: string,
  alertType: AlertType,
  message: string
): string {
  const color = alertType === 'down' ? '#ef4444' : alertType === 'degraded' ? '#f59e0b' : '#ef4444';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: ${color}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
    .footer { margin-top: 20px; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">${formatAlertType(alertType)}</h2>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">${projectName}</p>
    </div>
    <div class="content">
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <p><strong>Details:</strong></p>
      <p>${message}</p>
    </div>
    <div class="footer">
      Sent by Infrastructure Observatory
    </div>
  </div>
</body>
</html>
  `.trim();
}
