import { formatError } from './formatter/index.js';

// Global hooks to catch all unhandled errors
process.on('uncaughtException', (err) => {
  console.error('\n 🔥 UNCAUGHT EXCEPTION DETECTED:');
  console.error(formatError(err));
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('\n 🔥 UNHANDLED REJECTION DETECTED:');
  console.error(formatError(reason instanceof Error ? reason : new Error(String(reason))));
});

console.log('✅ IntellError register loaded.');
