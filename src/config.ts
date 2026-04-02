export interface IntellErrorConfig {
  showNodeModules: boolean;
  showNodeInternals: boolean;
  suggestionsEnabled: boolean;
  interceptWarnings: boolean;
  showSearchLinks: boolean;
  webhookUrl?: string;
}

let config: IntellErrorConfig = {
  showNodeModules: false,
  showNodeInternals: false,
  suggestionsEnabled: true,
  interceptWarnings: false,
  showSearchLinks: true,
};

/**
 * Updates the global configuration for IntellError.
 * @param newConfig Partial configuration object
 */
export function setupConfig(newConfig: Partial<IntellErrorConfig>) {
  config = { ...config, ...newConfig };
}

/**
 * Returns the current configuration.
 */
export function getConfig(): IntellErrorConfig {
  return config;
}
