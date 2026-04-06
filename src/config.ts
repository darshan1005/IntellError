export interface IntellErrorConfig {
  showNodeModules: boolean;
  showNodeInternals: boolean;
  suggestionsEnabled: boolean;
  interceptWarnings: boolean;
  showSearchLinks: boolean;
  sourceMapsEnabled: boolean;
  useJsonMode: boolean; // NEW: Should registration use JSON formatting by default?
  webhookUrl?: string;
}

const env = typeof process !== 'undefined' ? process.env : {};

let config: IntellErrorConfig = {
  showNodeModules: env.INTELLERROR_SHOW_MODULES === 'true',
  showNodeInternals: env.INTELLERROR_SHOW_INTERNALS === 'true',
  suggestionsEnabled: env.INTELLERROR_SUGGESTIONS !== 'false',
  interceptWarnings: env.INTELLERROR_INTERCEPT_WARNINGS === 'true',
  showSearchLinks: env.INTELLERROR_SEARCH_LINKS !== 'false',
  sourceMapsEnabled: env.INTELLERROR_SOURCE_MAPS !== 'false',
  useJsonMode: env.INTELLERROR_JSON === 'true',
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
