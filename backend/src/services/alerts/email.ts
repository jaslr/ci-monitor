import { Resend } from 'resend';
import { env } from '../../config/env.js';

let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    if (!env.resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }
    resend = new Resend(env.resendApiKey);
  }
  return resend;
}

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!env.resendApiKey) {
    console.warn('Email not configured, skipping:', options.subject);
    return;
  }

  try {
    const client = getResend();

    await client.emails.send({
      from: 'Observatory <alerts@observatory.dev>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log(`Email sent to ${options.to}: ${options.subject}`);
  } catch (err) {
    console.error('Failed to send email:', err);
    throw err;
  }
}
