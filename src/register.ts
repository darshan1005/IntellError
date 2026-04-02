import { formatError, formatWarning } from './formatter/index.js';
import { formatErrorBrowser, formatWarningBrowser } from './formatter/browser.js';
import { getConfig } from './config.js';
import { sendWebhookNotification } from './integrations/webhook.js';

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

if (isBrowser) {
  // --- BROWSER REGISTRATION ---
  window.addEventListener('error', (event) => {
    // We only want to handle the error if it contains an Error object
    if (event.error) {
      console.error('%c 🛑 UNHANDLED RUNTIME ERROR:', 'background: #ff4d4f; color: white; font-weight: bold; padding: 2px 5px;');
      console.log(...formatErrorBrowser(event.error));
      sendWebhookNotification(event.error);
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('%c 🛑 UNHANDLED PROMISE REJECTION:', 'background: #ff4d4f; color: white; font-weight: bold; padding: 2px 5px;');
    const reason = event.reason;
    const error = reason instanceof Error ? reason : new Error(String(reason));
    console.log(...formatErrorBrowser(error));
    sendWebhookNotification(error);
  });

  console.log('%c ✅ IntellError Browser listener active.', 'color: #52c41a; font-weight: bold;');
} else if (typeof process !== 'undefined' && process.on) {
  // --- NODE.JS REGISTRATION ---
  process.on('uncaughtException', (err) => {
    console.error('\n 🔥 UNCAUGHT EXCEPTION DETECTED:');
    console.error(formatError(err));
    sendWebhookNotification(err).finally(() => {
        process.exit(1);
    });
  });

  process.on('unhandledRejection', (reason) => {
    console.error('\n 🔥 UNHANDLED REJECTION DETECTED:');
    const error = reason instanceof Error ? reason : new Error(String(reason));
    console.error(formatError(error));
    sendWebhookNotification(error);
  });

  console.log('✅ IntellError Node.js listener active.');
}

// --- OPTIONAL WARNING INTERCEPTION ---
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  const config = getConfig();
  
  if (config.interceptWarnings && args.length > 0) {
    const message = args[0];
    if (typeof message === 'string') {
        const isBrowser = typeof window !== 'undefined';
        if (isBrowser) {
            originalWarn(...formatWarningBrowser(message));
        } else {
            originalWarn(formatWarning(message));
        }
        return;
    }
  }
  
  originalWarn(...args);
};

