import { config, createLogger, format, transports } from "winston";
const { combine, timestamp, printf } = format;

import { Logger, LogProps } from "../Budgeting/use-case/types";

export class WinstonLogger implements Logger {
  #logger = createLogger({
    levels: config.npm.levels,
    format: combine(
      timestamp(),
      printf((info) => `[${info.level}]: ${info.message} @ ${info.timestamp} `)
    ),
    transports: new transports.Console(),
  });

  log(props: LogProps) {
    this.#logger.log({ level: props.level, message: props.message });
  }
}
