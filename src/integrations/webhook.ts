import { getConfig } from '../config.js';

/**
 * Sends the error details to a Slack or Discord webhook.
 */
export async function sendWebhookNotification(error: Error) {
    const config = getConfig();
    if (!config.webhookUrl) return;

    const payload = {
        text: `🔥 *IntellError Alert*\n*Error:* ${error.constructor.name}\n*Message:* ${error.message}\n\n*Stack Trace Overview:*\n\`\`\`\n${error.stack?.split('\n').slice(0, 5).join('\n')}\n\`\`\``
    };

    try {
        await fetch(config.webhookUrl, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        // Silently fail to avoid crashing the error handler itself
    }
}
