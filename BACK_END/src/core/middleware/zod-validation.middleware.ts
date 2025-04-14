import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { HttpException } from '../errors/http-exception'; // Your custom HttpException
import { logger } from '../utils/logger';

// Extends Express Request type to potentially hold validated data
declare global {
    namespace Express {
        interface Request {
            validatedBody?: any;
            validatedQuery?: any;
            validatedParams?: any;
        }
    }
}

/**
 * Formats Zod errors into a user-friendly array of messages.
 */
function formatZodError(error: ZodError): string[] {
  return error.errors.map(err => `${err.path.join('.') || 'error'}: ${err.message}`);
  // Alternative simple format: error.errors.map(err => err.message)
}

/**
 * Middleware factory for validating request data using a Zod schema.
 * @param schema The Zod schema to validate against.
 * @param valueSource Specifies where to get the data from ('body', 'query', 'params').
 * @returns Express RequestHandler
 */
export function zodValidationMiddleware(
  schema: ZodSchema<any>, // Accepts any Zod schema
  valueSource: 'body' | 'query' | 'params' = 'body'
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = req[valueSource];
    const propertyToSet = `validated${valueSource.charAt(0).toUpperCase() + valueSource.slice(1)}` as keyof Express.Request; // e.g., validatedBody

    logger.debug(`[ZodMiddleware] Validating request ${valueSource} against schema: ${schema.description || 'Unnamed Schema'}`);

    try {
      // safeParse doesn't throw, returns result object
      const validationResult = await schema.safeParseAsync(dataToValidate); // Use async if schema has async refinements

      if (!validationResult.success) {
        const formattedErrors = formatZodError(validationResult.error);
        logger.warn(`[ZodMiddleware] Validation failed: ${formattedErrors.join('; ')}`);
        // Throw HttpException to be caught by global error handler
        throw new HttpException(400, `Validation Failed: ${formattedErrors.join(', ')}`);
      }

      // Validation successful, attach validated (and potentially transformed) data to request
      logger.debug(`[ZodMiddleware] Validation successful for request ${valueSource}`);
      req[propertyToSet] = validationResult.data;

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      // Catch HttpException or other unexpected errors during validation
      logger.error(`[ZodMiddleware] Error during validation: ${error}`);
      next(error); // Pass error to the global error handler
    }
  };
}