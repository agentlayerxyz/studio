import { pino } from "pino";

// Configure logger options
const loggerOptions = {
  level: process.env.LOG_LEVEL ?? "info",
  formatters: {
    level: (label: string) => {
      return { level: label };
    },
  },
  timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
};

// Create and export the logger instance
export const logger = pino(loggerOptions);

// Export common log levels for convenience
export const logError = logger.error.bind(logger);
export const logWarn = logger.warn.bind(logger);
export const logInfo = logger.info.bind(logger);
export const logDebug = logger.debug.bind(logger);
