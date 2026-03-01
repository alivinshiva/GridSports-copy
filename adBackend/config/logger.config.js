import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define colors for each log level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
};

winston.addColors(colors);

// Determine log level based on environment
const level = () => {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
};

// Define custom format
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `[ADMIN] ${info.timestamp} ${info.level}: ${info.message}`
    )
);

// Define transports
const transports = [
    // Console transport - only in development
    new winston.transports.Console({
        format: format,
    }),
];

// Only add file transports in production
if (process.env.NODE_ENV === 'production') {
    // Error logs - rotate daily, keep for 14 days
    transports.push(
        new DailyRotateFile({
            filename: path.join('logs', 'admin-error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '14d',
            maxSize: '20m',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        })
    );

    // Combined logs - rotate daily, keep for 7 days
    transports.push(
        new DailyRotateFile({
            filename: path.join('logs', 'admin-combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '7d',
            maxSize: '20m',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
        })
    );
}

// Create the logger
const logger = winston.createLogger({
    level: level(),
    levels,
    transports,
    // Handle uncaught exceptions and rejections
    exceptionHandlers: process.env.NODE_ENV === 'production' ? [
        new DailyRotateFile({
            filename: path.join('logs', 'admin-exceptions-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
        }),
    ] : [],
    rejectionHandlers: process.env.NODE_ENV === 'production' ? [
        new DailyRotateFile({
            filename: path.join('logs', 'admin-rejections-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
        }),
    ] : [],
});

export default logger;
