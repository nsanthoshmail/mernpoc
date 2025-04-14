"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodValidationMiddleware = zodValidationMiddleware;
const http_exception_1 = require("../errors/http-exception"); // Your custom HttpException
const logger_1 = require("../utils/logger");
/**
 * Formats Zod errors into a user-friendly array of messages.
 */
function formatZodError(error) {
    return error.errors.map(err => `${err.path.join('.') || 'error'}: ${err.message}`);
    // Alternative simple format: error.errors.map(err => err.message)
}
/**
 * Middleware factory for validating request data using a Zod schema.
 * @param schema The Zod schema to validate against.
 * @param valueSource Specifies where to get the data from ('body', 'query', 'params').
 * @returns Express RequestHandler
 */
function zodValidationMiddleware(schema, // Accepts any Zod schema
valueSource = 'body') {
    return async (req, res, next) => {
        const dataToValidate = req[valueSource];
        const propertyToSet = `validated${valueSource.charAt(0).toUpperCase() + valueSource.slice(1)}`; // e.g., validatedBody
        logger_1.logger.debug(`[ZodMiddleware] Validating request ${valueSource} against schema: ${schema.description || 'Unnamed Schema'}`);
        try {
            // safeParse doesn't throw, returns result object
            const validationResult = await schema.safeParseAsync(dataToValidate); // Use async if schema has async refinements
            if (!validationResult.success) {
                const formattedErrors = formatZodError(validationResult.error);
                logger_1.logger.warn(`[ZodMiddleware] Validation failed: ${formattedErrors.join('; ')}`);
                // Throw HttpException to be caught by global error handler
                throw new http_exception_1.HttpException(400, `Validation Failed: ${formattedErrors.join(', ')}`);
            }
            // Validation successful, attach validated (and potentially transformed) data to request
            logger_1.logger.debug(`[ZodMiddleware] Validation successful for request ${valueSource}`);
            req[propertyToSet] = validationResult.data;
            next(); // Proceed to the next middleware or route handler
        }
        catch (error) {
            // Catch HttpException or other unexpected errors during validation
            logger_1.logger.error(`[ZodMiddleware] Error during validation: ${error}`);
            next(error); // Pass error to the global error handler
        }
    };
}
