import { parseStack } from '../parser/index.js';
import { getSuggestions } from '../suggestions/index.js';

/**
 * Formats an error for the browser console using CSS styling (%c).
 * Use it like: console.log(...formatErrorBrowser(err));
 */
export function formatErrorBrowser(error: Error | unknown): any[] {
  if (!(error instanceof Error)) {
    return [String(error)];
  }

  const stackFrames = parseStack(error);
  const userFrame = stackFrames.find(frame => !frame.isNodeInternal && !frame.isNodeModule);

  const errorType = error.constructor.name || 'Error';
  const suggestions = getSuggestions(error);

  let text = `\n%c ${errorType} %c ${error.message}\n\n`;
  const styles = [
    'background: #ff4d4f; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;',
    'color: #ff4d4f; font-weight: bold;'
  ];

  if (userFrame && userFrame.file) {
    text += `%c📍 Location:%c\n`;
    styles.push('font-weight: bold;', '');
    
    text += `%c${userFrame.file}:${userFrame.lineNumber}:${userFrame.column}%c   (YOUR CODE)\n\n`;
    styles.push('color: #1890ff; text-decoration: underline;', 'color: grey; font-style: italic;');
  }

  if (suggestions.length > 0) {
    text += `%c💡 Suggestions:%c\n`;
    styles.push('font-weight: bold;', '');

    for (const suggestion of suggestions) {
      text += `%c• ${suggestion.message}%c\n`;
      styles.push('color: #52c41a; font-weight: bold;', '');
      
      if (suggestion.description) {
        text += `  %c${suggestion.description}%c\n`;
        styles.push('color: grey;', '');
      }
      
      if (suggestion.fix) {
        text += `  %cFix: ${suggestion.fix}%c\n`;
        styles.push('color: #1890ff;', '');
      }
    }
    text += `\n`;
  }

  text += `%c📦 Stack:%c\n`;
  styles.push('font-weight: bold;', '');

  let hiddenInternalsCount = 0;
  let hiddenModulesCount = 0;

  for (const frame of stackFrames) {
    if (frame.isNodeInternal) {
      hiddenInternalsCount++;
      continue;
    }
    
    if (frame.isNodeModule) {
      hiddenModulesCount++;
      continue; 
    }
    
    const fileStr = frame.file 
      ? `${frame.file}:${frame.lineNumber}:${frame.column}` 
      : '<unknown>';
      
    text += `→ %c${fileStr}%c\n`;
    styles.push('color: #1890ff;', '');
  }

  if (hiddenModulesCount > 0 || hiddenInternalsCount > 0) {
    const messages = [];
    if (hiddenModulesCount > 0) messages.push(`${hiddenModulesCount} node_modules`);
    if (hiddenInternalsCount > 0) messages.push(`${hiddenInternalsCount} node internals`);
    text += `%c(${messages.join(' and ')} hidden)%c\n`;
    styles.push('color: grey; font-style: italic;', '');
  }

  return [text, ...styles];
}
