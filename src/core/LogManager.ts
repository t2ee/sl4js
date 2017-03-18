import {
    Container,
    Injectable,
    AutoWired,
    ClassConstructors,
} from '@t2ee/core';

import Logger from './Logger';
import LogLevel from './LogLevel';
import Appender from './Appender';
import Configuration from '../config/Configuration';
import AppenderConfiguration from '../config/AppenderConfiguration';
import PatternLayout from './PatternLayout';

import ConsoleAppender from '../appenders/ConsoleAppender';
import FileAppender from '../appenders/FileAppender';

@Injectable
export class LogManager {
    private static instance: LogManager;
    private loggers: {[name: string]: Logger} = {};
    private appenders: {
        [name: string]: ClassConstructors.ClassConstructor3<Appender<any>, PatternLayout, string, any>,
    } = {
        console: ConsoleAppender,
        file: FileAppender,
    };

    public static getInstance(config?: Configuration): LogManager {
        if (!LogManager.instance) {
            LogManager.instance = Container.get(LogManager, Container.DefaultProvider);
            if (config) {
                LogManager.instance.configuration = config;
            }
        }

        return LogManager.instance;
    }

    @AutoWired
    private configuration: Configuration;

    public getLogger(name?: string): Logger {
        const isRoot: boolean = !!name;

        if (!this.configuration.root && !this.configuration.appenders) {
            this.configuration = {
                root: {
                    level: LogLevel.DEBUG,
                    default: 'console',
                },
                appenders: [{
                    name: 'console',
                    appender: 'console',
                    pattern: '[%d{YYYY-MM-DD HH:mm:ss}] %4l %10n %5p - %2w  %m',
                    level: LogLevel.DEBUG,
                }],
            };
            this.getLogger().warn('No configuration file found for sl4js, using default configuration.');
        }
        name = name || this.configuration.root.default;
        if (name in this.loggers) {
            return this.loggers[name];
        }
        const config: AppenderConfiguration =
            this.configuration.appenders.find((appender: AppenderConfiguration) => appender.name === name);
        if (config && config.appender in this.appenders) {
            const level: LogLevel = isRoot ? this.configuration.root.level : config.level;
            const logger: Logger = new Logger(
                new this.appenders[config.appender](
                    new PatternLayout(config.pattern), name, config,
                ),
            level);
            this.loggers[name] = logger;

            return logger;
        }

        return null;
    }

    public registerAppender(
        name: string,
        appender: ClassConstructors.ClassConstructor2<Appender<any>,
        PatternLayout, any>,
    ): void {
        this.appenders[name] = appender;
    }
}

export default LogManager;
