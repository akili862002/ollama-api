import * as winston from 'winston';

export const createLogger = (args: { name: string }) => {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: args.name },
    transports: [
      new winston.transports.File({
        filename: `tmp/logs/errors-${args.name}.log`,
        level: 'error',
      }),
      new winston.transports.File({ filename: 'tmp/logs/combined.log' }),
    ],
  });

  return logger;
};
