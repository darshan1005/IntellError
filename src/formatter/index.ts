import chalk from 'chalk';
import { parseStack } from '../parser/index.js';
import { getSuggestions } from '../suggestions/index.js';

export function formatError(error: Error | unknown): string {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const stackFrames = parseStack(error);
  
  // Find first user frame that is not node internal or node_modules
  const userFrame = stackFrames.find(frame => !frame.isNodeInternal && !frame.isNodeModule);

  const errorType = error.constructor.name || 'Error';
  const typeLabel = chalk.bgRed.white(` ${errorType} `);
  let output = `\n${typeLabel} ${chalk.red(error.message)}\n\n`;

  if (userFrame && userFrame.file) {
    output += `${chalk.bold('📍 Location:')}\n`;
    output += `${chalk.cyan(userFrame.file)}:${chalk.yellow(userFrame.lineNumber)}:${chalk.yellow(userFrame.column)}   ${chalk.gray('← YOUR CODE')}\n\n`;
  }

  const suggestions = getSuggestions(error);
  if (suggestions.length > 0) {
    output += `${chalk.bold('💡 Suggestions:')}\n`;
    for (const suggestion of suggestions) {
      output += `• ${chalk.green(suggestion.message)}\n`;
      if (suggestion.description) {
          output += `  ${chalk.dim(suggestion.description)}\n`;
      }
      if (suggestion.fix) {
          output += `  ${chalk.blue('Fix: ' + suggestion.fix)}\n`;
      }
    }
    output += `\n`;
  }

  output += `${chalk.bold('📦 Stack:')}\n`;
  
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
      ? `${chalk.cyan(frame.file)}:${chalk.yellow(frame.lineNumber)}:${chalk.yellow(frame.column)}` 
      : chalk.gray('<unknown>');
      
    output += `→ ${fileStr}\n`;
  }

  if (hiddenModulesCount > 0 || hiddenInternalsCount > 0) {
    const hiddenMessages = [];
    if (hiddenModulesCount > 0) hiddenMessages.push(`${hiddenModulesCount} node_modules`);
    if (hiddenInternalsCount > 0) hiddenMessages.push(`${hiddenInternalsCount} node internals`);
    output += chalk.dim(`(${hiddenMessages.join(' and ')} hidden)\n`);
  }

  return output;
}
