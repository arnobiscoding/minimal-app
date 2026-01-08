/**
 * Structured logging utility
 * In production, this should integrate with a logging service (e.g., Sentry, LogRocket)
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  userId?: string;
  matchId?: string;
  action?: string;
  [key: string]: any;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? JSON.stringify(context) : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${contextStr}`;
  }

  info(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV !== "production") {
      console.log(this.formatMessage("info", message, context));
    }
    // In production, send to logging service
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage("warn", message, context));
    // In production, send to logging service
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error?.message,
      stack: error?.stack,
    };
    console.error(this.formatMessage("error", message, errorContext));
    // In production, send to error tracking service (e.g., Sentry)
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === "development") {
      console.debug(this.formatMessage("debug", message, context));
    }
  }
}

export const logger = new Logger();

