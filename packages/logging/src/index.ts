import { pino } from "pino";

export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

export interface LoggerOptions {
  level?: LogLevel;
  timestamp?: boolean;
  service?: string;
  logDir?: string;
  useStdErr?: boolean;
}

class Logger {
  private logger: pino.Logger;

  constructor(options: LoggerOptions = {}) {
    const isDev = process.env.NODE_ENV === "development";

    const {
      level = process.env.LOG_LEVEL ?? (isDev ? "debug" : "info"),
      timestamp = true,
      service = "agentlayer",
      useStdErr = false,
    } = options;

    const logDir = `${options.logDir ?? process.env.LOG_DIR ?? "logs"}/${service}.log`;

    const transport = isDev
      ? pino.transport({
          targets: [
            {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname",
                destination: useStdErr ? 2 : 1,
              },
            },
          ],
        })
      : pino.transport({
          targets: [
            {
              target: "pino-pretty",
              options: {
                levelFirst: true,
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname",
                destination: useStdErr ? 2 : 1,
              },
            },
            {
              target: "pino/file",
              options: {
                destination: logDir,
                mkdir: true,
              },
            },
          ],
        });

    this.logger = pino({
      level,
      transport,
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
