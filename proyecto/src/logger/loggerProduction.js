const { createLogger, transports, format } = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'your-service-name' },
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'errors.log', level: 'error' })
    ]
});

class LoggerProduction {
    info(message) {
        logger.info(`[INFO] ${message}`);
    }

    error(message) {
        logger.error(`[ERROR] ${message}`);
    }
}

module.exports = new LoggerProduction();

