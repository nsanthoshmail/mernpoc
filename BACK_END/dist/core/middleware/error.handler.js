"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_exception_1 = require("../errors/http-exception");
const logger_1 = require("../utils/logger"); // Assume a logger utility exists
const errorHandler = (err, req, res, next // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
    // Log the error internally
    logger_1.logger.error(`[ErrorHandler] ${err.message}`, { stack: err.stack });
    if (err instanceof http_exception_1.HttpException) {
        res.status(err.status).json({
            statusCode: err.status,
            message: err.message,
            error: err.name, // e.g., "NotFoundException"
        });
    }
    else {
        // Handle unexpected errors
        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            error: 'InternalServerError',
        });
    }
};
exports.errorHandler = errorHandler;
