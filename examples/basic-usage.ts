import { formatError } from '../src/index.js';

function triggerError() {
  const obj: any = {};
  // TypeError: Cannot read properties of undefined (reading 'first')
  return obj.name.first; 
}

function processData() {
  triggerError();
}

try {
  processData();
} catch (error) {
  console.log('--- BASIC ERROR EXAMPLE ---');
  console.log(formatError(error));
}
