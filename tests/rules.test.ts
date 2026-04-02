import { describe, it, expect } from 'vitest';
import { getSuggestions } from '../src/suggestions/index.js';

describe('Intelligent Suggestions Rules', () => {
  it('should match TypeError for undefined properties', () => {
    const error = new TypeError("Cannot read properties of undefined (reading 'id')");
    const suggestions = getSuggestions(error);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].message).toContain('Accessing property on undefined object');
    expect(suggestions[0].fix).toContain('optional chaining');
  });

  it('should match EADDRINUSE error', () => {
    const error: any = new Error("bind EADDRINUSE 0.0.0.0:3000");
    error.code = 'EADDRINUSE';
    const suggestions = getSuggestions(error);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].message).toContain('Port already in use');
  });

  it('should match React Hooks error', () => {
    const error = new Error("Hooks can only be called inside of the body of a function component");
    const suggestions = getSuggestions(error);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].message).toContain('Invalid Hook Call');
  });

  it('should return no suggestions for unknown errors', () => {
    const error = new Error("Random unknown error message");
    const suggestions = getSuggestions(error);
    expect(suggestions.length).toBe(0);
  });
});
