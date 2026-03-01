/**
 * Admin Frontend Logger
 * 
 * Logs are only visible in development mode.
 * In production (NODE_ENV=production), all logs are suppressed
 * so users cannot see them even in browser DevTools.
 * 
 * For production error tracking, integrate with services like:
 * - Sentry (error monitoring)
 * - LogRocket (session replay + logging)
 * - DataDog (APM + logging)
 */

const isDevelopment = import.meta.env.DEV;

const logger = {
    info: (message, ...args) => {
        if (isDevelopment) {
            console.log(`[ADMIN-INFO] ${message}`, ...args);
        }
    },

    error: (message, ...args) => {
        if (isDevelopment) {
            console.error(`[ADMIN-ERROR] ${message}`, ...args);
        }
        // In production, you could send to an error tracking service here
        // Example: Sentry.captureException(new Error(message));
    },

    warn: (message, ...args) => {
        if (isDevelopment) {
            console.warn(`[ADMIN-WARN] ${message}`, ...args);
        }
    },

    debug: (message, ...args) => {
        if (isDevelopment) {
            console.debug(`[ADMIN-DEBUG] ${message}`, ...args);
        }
    },
};

export default logger;
