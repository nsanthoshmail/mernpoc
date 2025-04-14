// src/core/middleware/error.handler.ts
import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../errors/http-exception';
import { logger } from '../utils/logger'; // Assume a logger utility exists

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
): void => {
  // Log the error internally
  logger.error(`[ErrorHandler] ${err.message}`, { stack: err.stack });

  if (err instanceof HttpException) {
    res.status(err.status).json({
      statusCode: err.status,
      message: err.message,
      error: err.name, // e.g., "NotFoundException"
    });
  } else {
    // Handle unexpected errors
    res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      error: 'InternalServerError',
    });
  }
};
