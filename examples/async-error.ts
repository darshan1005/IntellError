import { formatError } from '../src/index.js';

async function fetchFromBackend() {
  throw new Error("Failed to connect to the backend server.");
}

async function handleRequest() {
  try {
      await fetchFromBackend();
  } catch (error) {
      console.log('--- ASYNC ERROR EXAMPLE ---');
      console.error(formatError(error));
  }
}

handleRequest();
