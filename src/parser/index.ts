import * as stackTraceParser from 'stacktrace-parser';
import fs from 'fs';
import path from 'path';
import { SourceMapConsumer } from 'source-map-js';
import { getConfig } from '../config.js';

export interface ParsedStackFrame {
  file: string | null;
  methodName: string;
  lineNumber: number | null;
  column: number | null;
  isNodeInternal: boolean;
  isNodeModule: boolean;
  originalFile?: string | null;
  originalLineNumber?: number | null;
  originalColumn?: number | null;
}

export interface ErrorChain {
  error: Error;
  frames: ParsedStackFrame[];
}

// Last updated: Node.js v22. Source:
// https://nodejs.org/api/module.html#modulebuiltinmodules
const NODE_BUILTINS = new Set([
  'assert', 'async_hooks', 'buffer', 'child_process', 'cluster', 'console',
  'constants', 'crypto', 'dgram', 'diagnostics_channel', 'dns', 'domain',
  'events', 'fs', 'http', 'http2', 'https', 'inspector', 'loader', 'module', 'net',
  'os', 'path', 'perf_hooks', 'process', 'punycode', 'querystring', 'readline',
  'repl', 'stream', 'string_decoder', 'sys', 'timers', 'tls', 'trace_events',
  'tty', 'url', 'util', 'v8', 'vm', 'worker_threads', 'zlib'
]);

export function parseStack(error: Error): ParsedStackFrame[] {
  if (!error.stack) return [];
  
  const parsed = stackTraceParser.parse(error.stack);
  
  return parsed.map(frame => {
    const file = frame.file || '';
    
    const isNodeInternal = 
      file.startsWith('node:') || 
      file.startsWith('internal/') ||
      NODE_BUILTINS.has(file.replace(/\.js$/, '').replace(/^node:/, ''));
      
    const isNodeModule = file.includes('node_modules');

    const result: ParsedStackFrame = {
      file: frame.file,
      methodName: frame.methodName || '<unknown>',
      lineNumber: frame.lineNumber,
      column: frame.column,
      isNodeInternal: Boolean(isNodeInternal),
      isNodeModule: Boolean(isNodeModule)
    };

    // Try to enrich with source maps (Node only, synchronous for now)
    const config = getConfig();
    if (config.sourceMapsEnabled && !isNodeInternal && !isNodeModule && frame.file && frame.lineNumber && frame.column) {
        try {
            const mapPath = `${frame.file}.map`;
            if (fs.existsSync(mapPath)) {
                const mapContent = fs.readFileSync(mapPath, 'utf-8');
                const consumer = new SourceMapConsumer(JSON.parse(mapContent));
                const original = consumer.originalPositionFor({
                    line: frame.lineNumber,
                    column: frame.column
                });
                
                if (original.source) {
                    result.originalFile = original.source;
                    result.originalLineNumber = original.line;
                    result.originalColumn = original.column;
                }
            }
        } catch (e) {
            // Silently ignore source map errors
        }
    }

    return result;
  });
}

export function getErrorChain(error: Error): ErrorChain[] {
    const chain: ErrorChain[] = [];
    let currentError: Error | undefined = error;
    
    while (currentError) {
        chain.push({
            error: currentError,
            frames: parseStack(currentError)
        });
        
        // Handle Error.cause (Node 16.9+, modern browsers)
        currentError = (currentError as any).cause instanceof Error ? (currentError as any).cause : undefined;
    }
    
    return chain;
}
