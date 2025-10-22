import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Async handler wrapper to catch errors in async route handlers
 * Prevents server crashes from unhandled promise rejections
 */
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
