import { createLogger, format, transports } from 'winston';
import fs from 'fs';
import path from 'path';

const { combine, timestamp, printf, errors, splat, colorize, json } = format;

const logFormat = printf(({ level, message, timestamp: ts, stack, ...meta }) => {
  const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${ts} [${level}]: ${stack || message}${metaString}`;
});

const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), errors({ stack: true }), splat(), json()),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    }),
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});

logger.stream = {
  write: (message) => logger.info(message.trim()),
};

export default logger;
