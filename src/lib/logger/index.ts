import * as bunyan from 'bunyan';
import bunyanLogstash = require('bunyan-logstash');

enum Level {
    TRACE = 'trace',
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    FATAL = 'fatal',
}

interface IUdpOption {
    host: string;
    port: string;
}

interface IConsoleOption {
    level?: string;
}

interface IFileOption {
    path: string;
    level?: string;
}

interface ILoggerConfig {
    udp?: IUdpOption;
    console?: IConsoleOption;
    file?: IFileOption;
}

export default class Logger extends bunyan {
    public constructor(appName: string, options: ILoggerConfig = {}) {
        const level = 'info';
        const streams = [];

        if (options.udp) {
            streams.push({
                level: getLogLevel(level),
                stream: bunyanLogstash.createStream({
                    level: level,
                    appName: appName,
                    host: options.udp.host,
                    port: options.udp.port,
                }),
            });
        }

        if (options.console) {
            streams.push({
                level: getLogLevel(options.console.level),
                stream: process.stdout,
            });
        }

        if (options.file) {
            streams.push({
                level: getLogLevel(options.file.level || level),
                path: options.file.path,
            });
        }

        super({ name: appName, streams: streams });
    }
}

function getLogLevel(level: string): number {
    switch (level) {
        case Level.TRACE:
            return bunyan.TRACE;
        case Level.DEBUG:
            return bunyan.DEBUG;
        case Level.INFO:
            return bunyan.INFO;
        case Level.WARN:
            return bunyan.WARN;
        case Level.ERROR:
            return bunyan.ERROR;
        case Level.FATAL:
            return bunyan.FATAL;
        default:
            return bunyan.DEBUG;
    }
}
