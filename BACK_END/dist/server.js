"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const app_1 = __importDefault(require("./app"));
const logger_1 = require("./core/utils/logger");
const PORT = process.env.PORT || 3000;
const server = app_1.default.listen(PORT, () => {
    logger_1.logger.info(`🚀 Server listening on port ${PORT}`);
    logger_1.logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
// Graceful Shutdown Handling (Optional but Recommended)
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach(signal => {
    process.on(signal, () => {
        logger_1.logger.warn(`Received ${signal}, shutting down gracefully...`);
        server.close(() => {
            logger_1.logger.info('HTTP server closed.');
            // Add cleanup for database connections, etc. here if needed
            process.exit(0);
        });
        // Force shutdown if server doesn't close within a timeout
        setTimeout(() => {
            logger_1.logger.error('Could not close connections in time, forcing shutdown.');
            process.exit(1);
        }, 10000); // 10 seconds timeout
    });
});
