// src/server.ts
import app from './app';
import { logger } from './core/utils/logger';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server listening on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful Shutdown Handling (Optional but Recommended)
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach(signal => {
    process.on(signal, () => {
        logger.warn(`Received ${signal}, shutting down gracefully...`);
        server.close(() => {
            logger.info('HTTP server closed.');
            // Add cleanup for database connections, etc. here if needed
            process.exit(0);
        });

        // Force shutdown if server doesn't close within a timeout
        setTimeout(() => {
            logger.error('Could not close connections in time, forcing shutdown.');
            process.exit(1);
        }, 10000); // 10 seconds timeout
    });
});