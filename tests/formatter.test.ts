import { describe, it, expect } from 'vitest';
import { formatError, formatErrorJSON } from '../src/formatter/index.js';

describe('Formatter', () => {
  it('should format errors with severity levels', () => {
    const error = new Error('Fatal failure');
    (error as any).severity = 'FATAL';
    
    const output = formatError(error);
    expect(output).toContain('FATAL');
    expect(output).toContain('Fatal failure');
  });

  it('should include fingerprint and timestamp in ANSI output', () => {
    const error = new Error('Fingerprint test');
    const output = formatError(error);
    
    expect(output).toMatch(/ID: [a-f0-9]{8}/);
    expect(output).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
  });

  it('should output valid JSON in formatErrorJSON', () => {
    const error = new Error('JSON test');
    const jsonStr = formatErrorJSON(error);
    const json = JSON.parse(jsonStr);
    
    expect(json.error.type).toBe('Error');
    expect(json.error.message).toBe('JSON test');
    expect(json.fingerprint).toBeDefined();
    expect(json.timestamp).toBeDefined();
    expect(json.uptime).toBeDefined();
  });

  it('should handle causes in JSON output', () => {
    const cause = new Error('Root cause');
    const error = new Error('Wrapper', { cause });
    
    const jsonStr = formatErrorJSON(error);
    const json = JSON.parse(jsonStr);
    
    expect(json.error.causes).toHaveLength(1);
    expect(json.error.causes[0].message).toBe('Root cause');
  });
});
