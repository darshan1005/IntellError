import { formatError } from '../formatter/index.js';
import type { Request, Response, NextFunction } from 'express';

export function errorFormatter() {
  return (err: any, _req: Request, res: Response, _next: NextFunction) => {
    const formatted = formatError(err);
    
    // Log to console with nice formatting
    console.error(formatted);

    // If headers not sent, send a standard error response
    if (!res.headersSent) {
      res.status(err.status || 500).json({
        error: {
          name: err.name,
          message: err.message,
          // We don't send the full formatted error to the client for security, 
          // but we provide the basic info.
        },
      });
    }
  };
}
