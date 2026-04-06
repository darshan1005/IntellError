import { formatError, formatWarning, formatErrorJSON } from './formatter/index.js';
import { formatErrorBrowser, formatWarningBrowser } from './formatter/browser.js';
import { getConfig } from './config.js';
import { sendWebhookNotification } from './integrations/webhook.js';

const isDeno = typeof (globalThis as any).Deno !== 'undefined';
const isBun = typeof (globalThis as any).Bun !== 'undefined';
const isNode = typeof process !== 'undefined' && process.release?.name === 'node';
const isEdge = typeof process !== 'undefined' && (process.env as any).NEXT_RUNTIME === 'edge';
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

if (isBrowser || isDeno) {
  // --- BROWSER / DENO / WEB-STD REGISTRATION ---
  const target = isBrowser ? window : globalThis;
  
  (target as any).addEventListener('error', (event: any) => {
    const error = event.error || event.message;
    if (error) {
      if (isBrowser) {
          console.error('%c 🛑 UNHANDLED RUNTIME ERROR:', 'background: #ff4d4f; color: white; font-weight: bold; padding: 2px 5px;');
          console.log(...formatErrorBrowser(error));
      } else {
          const config = getConfig();
          console.error('\n 🔥 UNHANDLED RUNTIME ERROR:');
          if (config.useJsonMode) {
              console.error(formatErrorJSON(error));
          } else {
              console.error(formatError(error));
          }
      }
      sendWebhookNotification(error);
    }
  });

  (target as any).addEventListener('unhandledrejection', (event: any) => {
    const reason = event.reason;
    const error = reason instanceof Error ? reason : new Error(String(reason));
    if (isBrowser) {
        console.error('%c 🛑 UNHANDLED PROMISE REJECTION:', 'background: #ff4d4f; color: white; font-weight: bold; padding: 2px 5px;');
        console.log(...formatErrorBrowser(error));
    } else {
        const config = getConfig();
        console.error('\n 🔥 UNHANDLED PROMISE REJECTION:');
        if (config.useJsonMode) {
            console.error(formatErrorJSON(error));
        } else {
            console.error(formatError(error));
        }
    }
    sendWebhookNotification(error);
  });

  const runtimeName = isBrowser ? 'Browser' : 'Deno';
  if (isBrowser) {
      console.log(`%c ✅ IntellError ${runtimeName} listener active.`, 'color: #52c41a; font-weight: bold;');
  } else {
      console.log(`✅ IntellError ${runtimeName} listener active.`);
  }
} else if (isNode || isBun || isEdge) {
  // --- NODE.JS / BUN / EDGE REGISTRATION ---
  process.on('uncaughtException', (err) => {
    const config = getConfig();
    console.error('\n 🔥 UNCAUGHT EXCEPTION DETECTED:');
    if (config.useJsonMode) {
        console.error(formatErrorJSON(err));
    } else {
        console.error(formatError(err));
    }
    sendWebhookNotification(err).finally(() => {
        if (!isEdge) process.exit(1); // Don't exit in Edge/Serverless environments
    });
  });

  process.on('unhandledRejection', (reason) => {
    const config = getConfig();
    console.error('\n 🔥 UNHANDLED REJECTION DETECTED:');
    const error = reason instanceof Error ? reason : new Error(String(reason));
    if (config.useJsonMode) {
        console.error(formatErrorJSON(error));
    } else {
        console.error(formatError(error));
    }
    sendWebhookNotification(error);
  });

  const runtimeName = isBun ? 'Bun' : (isEdge ? 'Edge' : 'Node.js');
  console.log(`✅ IntellError ${runtimeName} listener active.`);
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

