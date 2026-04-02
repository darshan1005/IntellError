import { formatError } from '../src/index.js';

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateInput(input: string) {
  if (input.length < 5) {
      throw new ValidationError("Input is too short! Must be at least 5 characters.");
  }
}

try {
  validateInput("abc");
} catch (error) {
  console.log('--- CUSTOM ERROR EXAMPLE ---');
  console.log(formatError(error));
}
