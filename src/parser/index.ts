import * as stackTraceParser from 'stacktrace-parser';

export interface ParsedStackFrame {
  file: string | null;
  methodName: string;
  lineNumber: number | null;
  column: number | null;
  isNodeInternal: boolean;
  isNodeModule: boolean;
}

export function parseStack(error: Error): ParsedStackFrame[] {
  if (!error.stack) return [];
  
  const parsed = stackTraceParser.parse(error.stack);
  
  return parsed.map(frame => {
    const file = frame.file || '';
    
    // Check if it's a built-in node module or internal
    // e.g. node:internal/... or just internal/... or events.js
    const isNodeInternal = 
      file.startsWith('node:') || 
      file.startsWith('internal/') ||
      !file.includes('/') && !file.includes('\\'); // typically a core module if no path separators
      
    const isNodeModule = file.includes('node_modules');

    return {
      file: frame.file,
      methodName: frame.methodName || '<unknown>',
      lineNumber: frame.lineNumber,
      column: frame.column,
      isNodeInternal: Boolean(isNodeInternal),
      isNodeModule: Boolean(isNodeModule)
    };
  });
}
