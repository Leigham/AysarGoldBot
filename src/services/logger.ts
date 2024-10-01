// logger.ts

import { createLogger, format, transports, Logger } from 'winston';
import { Format } from 'logform';

/**
 * Destructure necessary format functions from winston.format.
 */
const { combine, timestamp, printf, colorize, errors, json } = format;

/**
 * Determines if the application is running in production mode.
 * Used to adjust logging behavior for performance optimization.
 */
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Custom format for console logs.
 * Includes colorization and stack traces for errors in non-production environments.
 */
const consoleLogFormat: Format = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: !isProduction }), // Include stack traces only if not in production
  printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  }),
);

/**
 * Custom format for file logs.
 * Outputs logs in JSON format, including stack traces for errors.
 */
const fileLogFormat: Format = combine(
  timestamp(),
  errors({ stack: true }), // Always include stack traces in file logs
  json(),
);

/**
 * Initializes and configures a Winston logger instance.
 * The logger supports different transports for console and file outputs,
 * handles exceptions and rejections, and adapts to different environments.
 *
 * @constant
 * @type {Logger}
 */
const logger: Logger = createLogger({
  /**
   * Sets the minimum logging level based on the environment.
   * 'debug' level for development, 'info' level for production.
   */
  level: isProduction ? 'info' : 'debug',

  /**
   * Default format for logs; individual transports can override this.
   */
  format: fileLogFormat,

  /**
   * Defines the transports used for logging.
   */
  transports: [
    /**
     * Console transport for outputting logs to the console.
     * Uses a different format for development to include colorization and stack traces.
     * Silent in test environments to reduce noise.
     */
    new transports.Console({
      format: isProduction ? fileLogFormat : consoleLogFormat,
      handleExceptions: true,
      handleRejections: true,
      silent: process.env.NODE_ENV === 'test', // Silence logs during testing
    }),

    /**
     * File transport for logging error messages.
     * Logs are saved to 'logs/error.log'.
     * Implements file size limits and rotation.
     */
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      handleExceptions: true,
      handleRejections: true,
      maxsize: 5 * 1024 * 1024, // 5MB per file
      maxFiles: 5, // Keep up to 5 files
    }),

    /**
     * File transport for logging all messages.
     * Logs are saved to 'logs/combined.log'.
     * Implements file size limits and rotation.
     */
    new transports.File({
      filename: 'logs/combined.log',
      handleExceptions: true,
      handleRejections: true,
      maxsize: 10 * 1024 * 1024, // 10MB per file
      maxFiles: 5,
    }),
  ],

  /**
   * Prevents the logger from exiting the process on handled exceptions.
   */
  exitOnError: false,
});

/**
 * Logs an initialization message at the 'debug' level if not in production or test environments.
 */
if (!isProduction && process.env.NODE_ENV !== 'test') {
  logger.debug('Logger initialized at debug level');
}

/**
 * Exports the configured logger instance for use in other modules.
 */
export default logger;
