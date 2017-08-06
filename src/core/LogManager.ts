import {
    Container,
    AutoWired,
    Component,
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

@Component
export class LogManager {
    private static instance: LogManager;
    private loggers: {[name: string]: Logger} = {};
    private appenders: {
        [name: string]: ClassConstructors.ClassConstructor3<Appender<any>, PatternLayout, string, any>,
    } = {
        console: ConsoleAppender,
        file: FileAppender,
    };

    @AutoWired
    private configuration: Configuration;

    public static getLogger(name?: string): Logger {
        if (!LogManager.instance) {
            LogManager.instance = Container.get(LogManager);
        }
        const instance: LogManager = LogManager.instance;

        if (!instance.configuration.appenders) {
            instance.configuration.appenders = [{
                name: 'console',
                appender: 'console',
                pattern: '%d{YYYY-MM-DD HH:mm:ss.SSS} %-7c{[%l]} %10n %5p - %2w  %M',
                level: LogLevel.DEBUG,
            }];
        }

        if (!instance.configuration.default) {
            instance.configuration.default = 'console';
        }

        if (!instance.configuration.level) {
            instance.configuration.level = LogLevel.DEBUG;
        }

        name = name || instance.configuration.default;
        if (name in instance.loggers) {
            return instance.loggers[name];
        }


        const isRoot: boolean = name === instance.configuration.default;

        const config: AppenderConfiguration =
            instance.configuration.appenders.find((appender: AppenderConfiguration) => appender.name === name);
        if (config && config.appender in instance.appenders) {
            const level: LogLevel = isRoot ? instance.configuration.level : config.level;
            const logger: Logger = new Logger(
                new instance.appenders[config.appender](
                    new PatternLayout(config.pattern), name, config,
                ),
            level);
            instance.loggers[name] = logger;

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
