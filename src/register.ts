import { formatError } from './formatter/index.js';
import { formatErrorBrowser } from './formatter/browser.js';

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

if (isBrowser) {
  // --- BROWSER REGISTRATION ---
  window.addEventListener('error', (event) => {
    // We only want to handle the error if it contains an Error object
    if (event.error) {
      console.error('%c 🛑 UNHANDLED RUNTIME ERROR:', 'background: #ff4d4f; color: white; font-weight: bold; padding: 2px 5px;');
      console.log(...formatErrorBrowser(event.error));
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('%c 🛑 UNHANDLED PROMISE REJECTION:', 'background: #ff4d4f; color: white; font-weight: bold; padding: 2px 5px;');
    const reason = event.reason;
    const error = reason instanceof Error ? reason : new Error(String(reason));
    console.log(...formatErrorBrowser(error));
  });

  console.log('%c ✅ IntellError Browser listener active.', 'color: #52c41a; font-weight: bold;');
} else if (typeof process !== 'undefined' && process.on) {
  // --- NODE.JS REGISTRATION ---
  process.on('uncaughtException', (err) => {
    console.error('\n 🔥 UNCAUGHT EXCEPTION DETECTED:');
    console.error(formatError(err));
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    console.error('\n 🔥 UNHANDLED REJECTION DETECTED:');
    const error = reason instanceof Error ? reason : new Error(String(reason));
    console.error(formatError(error));
  });

  console.log('✅ IntellError Node.js listener active.');
}
