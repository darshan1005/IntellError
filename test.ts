import { formatError } from './src/index.js';

function triggerError() {
  const obj: any = {};
  console.log(obj.name.first); // TypeError: Cannot read properties of undefined
}

function intermediateFunction() {
  triggerError();
}

try {
  intermediateFunction();
} catch (error) {
  console.log(formatError(error));
}
