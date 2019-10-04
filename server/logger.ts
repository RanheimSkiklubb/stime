import {format, createLogger, transports} from 'winston';
import dateformat from 'dateformat';
import path from 'path';
const logLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug';
const logToFile = process.env.LOG_TO_FILE;

const levelToUppercaseFormat = format(info => {
    info.level = info.level.toUpperCase();
    return info;
});

const timestampFormat = format(info => {
    info.timestamp = dateformat(info.timestamp, 'yyyy-mm-dd hh:MM:ss,l');
    return info;
});

const commonFormat = format.combine(
    timestampFormat(),
    format.align(),
    format.printf(info => {
        return `[${info.level}] ${info.timestamp}:${info.message}`
    })
);

const consoleFormat = format.combine(
    levelToUppercaseFormat(),
    format.colorize(),
    commonFormat
);

const logFileFormat = format.combine(
    levelToUppercaseFormat(),
    commonFormat
);

const consoleTransport = () => new transports.Console({format: consoleFormat});
const fileTransport = () => new transports.File({
    filename: path.join(__dirname, 'server.log'),
    format: logFileFormat
});

const logger = createLogger({
        level: logLevel,
        transports: [logToFile ? fileTransport() : consoleTransport()]
    })
;

export default logger;
