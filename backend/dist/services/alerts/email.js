import { Resend } from 'resend';
import { env } from '../../config/env.js';
let resend = null;
function getResend() {
    if (!resend) {
        if (!env.resendApiKey) {
            throw new Error('RESEND_API_KEY not configured');
        }
        resend = new Resend(env.resendApiKey);
    }
    return resend;
}
export async function sendEmail(options) {
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
    }
    catch (err) {
        console.error('Failed to send email:', err);
        throw err;
    }
}
//# sourceMappingURL=email.js.map