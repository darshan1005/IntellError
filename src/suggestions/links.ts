/**
 * Generates search URLs for a given error based on its message and type.
 */
export function getSearchLinks(error: Error): string[] {
  const query = encodeURIComponent(`${error.constructor.name}: ${error.message}`);
  
  return [
    `https://www.google.com/search?q=${query}`,
    `https://stackoverflow.com/search?q=${query}`,
    `https://github.com/issues?q=${query}`
  ];
}
