import chalk from 'chalk';
import * as crypto from 'node:crypto';
import { parseStack, getErrorChain, type ParsedStackFrame, type ErrorChain } from '../parser/index.js';
import { getSuggestions } from '../suggestions/index.js';
import { getConfig } from '../config.js';
import { getCodeSnapshot } from './snapshot.js';
import { getSearchLinks } from '../suggestions/links.js';

function getFingerprint(type: string, frame: ParsedStackFrame | undefined): string {
  const frameId = frame ? `${frame.file}:${frame.lineNumber}:${frame.column}` : 'no-frame';
  return crypto.createHash('sha1').update(`${type}:${frameId}`).digest('hex').substring(0, 8);
}

export function formatError(error: Error | unknown): string {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const config = getConfig();
  const errorChain = getErrorChain(error);
  const topError = errorChain[0];
  const stackFrames = topError.frames;
  
  // Find first user frame that is not node internal or node_modules
  const userFrame = stackFrames.find(frame => !frame.isNodeInternal && !frame.isNodeModule);

  const errorType = error.constructor.name || 'Error';
  const severity = (error as any).severity || 'ERROR';
  
  const severityColors: Record<string, any> = {
    'FATAL': chalk.bgRed.white.bold,
    'ERROR': chalk.bgRed.white,
    'WARN': chalk.bgYellow.black,
    'INFO': chalk.bgBlue.white
  };
  
  const typeLabel = (severityColors[severity] || severityColors['ERROR'])(` ${severity} `);
  const timestamp = new Date().toISOString();
  const uptime = process.uptime().toFixed(1);
  const fingerprint = getFingerprint(errorType, userFrame);

  let output = `\n${typeLabel} ${chalk.red(`${errorType}: ${error.message}`)}\n`;
  output += chalk.dim(`${timestamp} | uptime: ${uptime}s | ID: ${fingerprint}\n\n`);

  if (userFrame && userFrame.file) {
    output += `${chalk.bold('📍 Location:')}\n`;
    const fileName = userFrame.originalFile || userFrame.file;
    const line = userFrame.originalLineNumber || userFrame.lineNumber;
    const col = userFrame.originalColumn || userFrame.column;
    const isMapped = userFrame.originalFile ? chalk.magenta(' [mapped]') : '';
    
    output += `${chalk.cyan(fileName)}:${chalk.yellow(line)}:${chalk.yellow(col)}${isMapped}   ${chalk.gray('← YOUR CODE')}\n\n`;
    
    // Add code snapshot (Node only)
    if (line && fileName && !userFrame.originalFile) { // Snapshot only for actual files on disk
        output += getCodeSnapshot(fileName, line);
    }
  }

  const suggestions = config.suggestionsEnabled ? getSuggestions(error) : [];
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

  if (config.showSearchLinks) {
    const searchLinks = getSearchLinks(error);
    output += `${chalk.bold('🔍 Troubleshoot:')}\n`;
    output += `• ${chalk.dim('Google:')} ${chalk.blue(searchLinks[0])}\n`;
    output += `• ${chalk.dim('StackOverflow:')} ${chalk.blue(searchLinks[1])}\n`;
    output += `• ${chalk.dim('GitHub:')} ${chalk.blue(searchLinks[2])}\n\n`;
  }

  // Handle causes
  if (errorChain.length > 1) {
      output += `${chalk.bold('🔗 Causes:')}\n`;
      for (let i = 1; i < errorChain.length; i++) {
          output += `${'  '.repeat(i)}caused by: ${chalk.red(errorChain[i].error.constructor.name)}: ${errorChain[i].error.message}\n`;
      }
      output += '\n';
  }

  output += `${chalk.bold('📦 Stack:')}\n`;
  
  let hiddenInternalsCount = 0;
  let hiddenModulesCount = 0;

  for (const frame of stackFrames) {
    if (frame.isNodeInternal && !config.showNodeInternals) {
      hiddenInternalsCount++;
      continue;
    }
    
    if (frame.isNodeModule && !config.showNodeModules) {
      hiddenModulesCount++;
      continue; 
    }
    
    const fileName = frame.originalFile || frame.file;
    const line = frame.originalLineNumber || frame.lineNumber;
    const col = frame.originalColumn || frame.column;
    const isMapped = frame.originalFile ? chalk.magenta('*') : '';

    const fileStr = fileName 
      ? `${chalk.cyan(fileName)}:${chalk.yellow(line)}:${chalk.yellow(col)}${isMapped}` 
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

export function formatErrorJSON(error: Error | unknown): string {
    if (!(error instanceof Error)) {
        return JSON.stringify({ error: String(error) });
    }

    const config = getConfig();
    const errorChain = getErrorChain(error);
    const topError = errorChain[0];
    const userFrame = topError.frames.find(frame => !frame.isNodeInternal && !frame.isNodeModule);

    return JSON.stringify({
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        severity: (error as any).severity || 'ERROR',
        fingerprint: getFingerprint(error.constructor.name, userFrame),
        error: {
            type: error.constructor.name,
            message: error.message,
            stack: topError.frames,
            causes: errorChain.slice(1).map(c => ({
                type: c.error.constructor.name,
                message: c.error.message
            }))
        },
        suggestions: config.suggestionsEnabled ? getSuggestions(error) : [],
        location: userFrame ? {
            file: userFrame.originalFile || userFrame.file,
            line: userFrame.originalLineNumber || userFrame.lineNumber,
            column: userFrame.originalColumn || userFrame.column,
            isMapped: !!userFrame.originalFile
        } : null
    }, null, 2);
}

export function formatWarning(message: string, error?: Error): string {
  const config = getConfig();
  const actualError = error || new Error(message);
  const stackFrames = parseStack(actualError);
  
  const userFrame = stackFrames.find(frame => !frame.isNodeInternal && !frame.isNodeModule);

  const typeLabel = chalk.bgYellow.black(` WARNING `);
  let output = `\n${typeLabel} ${chalk.yellow(message)}\n\n`;

  if (userFrame && userFrame.file) {
    output += `${chalk.bold('📍 Location:')}\n`;
    output += `${chalk.cyan(userFrame.file)}:${chalk.yellow(userFrame.lineNumber)}:${chalk.yellow(userFrame.column)}   ${chalk.gray('← YOUR CODE')}\n\n`;
  }

  const suggestions = config.suggestionsEnabled ? getSuggestions(actualError) : [];
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

  return output;
}
