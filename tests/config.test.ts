import { describe, it, expect } from 'vitest';
import { setupConfig, getConfig } from '../src/config.js';

describe('Config System', () => {
  it('should have default values', () => {
    const config = getConfig();
    expect(config.showNodeModules).toBe(false);
    expect(config.showNodeInternals).toBe(false);
    expect(config.suggestionsEnabled).toBe(true);
  });

  it('should update specific values', () => {
    setupConfig({ showNodeModules: true });
    const config = getConfig();
    expect(config.showNodeModules).toBe(true);
    expect(config.showNodeInternals).toBe(false); // remains same
  });

  it('should preserve existing values', () => {
    setupConfig({ suggestionsEnabled: false });
    const config = getConfig();
    expect(config.showNodeModules).toBe(true); // From previous test
    expect(config.suggestionsEnabled).toBe(false);
  });
});
