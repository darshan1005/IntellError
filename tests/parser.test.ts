import { describe, it, expect } from 'vitest';
import { parseStack, getErrorChain } from '../src/parser/index.js';

describe('Parser', () => {
  it('should identify node built-in modules correctly', () => {
    const error = new Error('test');
    error.stack = `Error: test
    at Object.<anonymous> (fs.js:1:1)
    at Module._compile (node:internal/modules/cjs/loader:1101:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Function.Module._load (node:internal/modules/cjs/loader:822:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:17:47`;

    const frames = parseStack(error);
    expect(frames[0].isNodeInternal).toBe(true); // fs.js
    expect(frames[1].isNodeInternal).toBe(true); // node:internal/...
    expect(frames[6].isNodeInternal).toBe(true); // node:internal/...
  });

  it('should NOT identify root-level user files as node internals', () => {
    const error = new Error('test');
    error.stack = `Error: test
    at Object.<anonymous> (index.ts:1:1)
    at Module._compile (loader.js:1:1)`;

    const frames = parseStack(error);
    expect(frames[0].isNodeInternal).toBe(false); // index.ts is user code
    expect(frames[1].isNodeInternal).toBe(true); // loader.js is internal
  });

  it('should traverse Error.cause correctly', () => {
    const cause = new Error('Original Cause');
    const error = new Error('Wrapper Error', { cause });

    const chain = getErrorChain(error);
    expect(chain).toHaveLength(2);
    expect(chain[0].error.message).toBe('Wrapper Error');
    expect(chain[1].error.message).toBe('Original Cause');
  });

  it('should handle anonymous frames and unknown methods', () => {
    const error = new Error('test');
    error.stack = `Error: test
    at <anonymous>:1:1`;

    const frames = parseStack(error);
    expect(frames[0].methodName).toBe('<unknown>');
  });
});
