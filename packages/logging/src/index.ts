import { pino } from "pino";

export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

export interface LoggerOptions {
  level?: LogLevel;
  pretty?: boolean;
  timestamp?: boolean;
  service?: string;
}

class Logger {
  private logger: pino.Logger;

  constructor(options: LoggerOptions = {}) {
    const {
      level = "info",
      pretty = process.env.NODE_ENV === "development",
      timestamp = true,
      service = "agentlayer",
    } = options;

    this.logger = pino({
      level,
      transport: pretty
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "SYS:standard",
              ignore: "pid,hostname",
            },
          }
        : undefined,
      timestamp: timestamp
        ? () => `,"time":"${new Date().toISOString()}"`
        : false,
      base: {
        service,
      },
    });
  }

  // Log level methods
  fatal(message: string, ...args: any[]): void {
    this.logger.fatal(message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.logger.error(message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.logger.warn(message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.logger.info(message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    this.logger.debug(message, ...args);
  }

  trace(message: string, ...args: any[]): void {
    this.logger.trace(message, ...args);
  }

  // Utility methods
  child(bindings: Record<string, any>): Logger {
    const childLogger = new Logger();
    childLogger.logger = this.logger.child(bindings);
    return childLogger;
  }

  setLevel(level: LogLevel): void {
    this.logger.level = level;
  }

  getLevel(): LogLevel {
    return this.logger.level as LogLevel;
  }
}

// Create a default logger instance
const defaultLogger = new Logger();

// Export the Logger class and default instance
export { Logger, defaultLogger as logger };

// Export convenience methods
export const fatal = (message: string, ...args: any[]) =>
  defaultLogger.fatal(message, ...args);
export const error = (message: string, ...args: any[]) =>
  defaultLogger.error(message, ...args);
export const warn = (message: string, ...args: any[]) =>
  defaultLogger.warn(message, ...args);
export const info = (message: string, ...args: any[]) =>
  defaultLogger.info(message, ...args);
export const debug = (message: string, ...args: any[]) =>
  defaultLogger.debug(message, ...args);
export const trace = (message: string, ...args: any[]) =>
  defaultLogger.trace(message, ...args);
