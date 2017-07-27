import ConsoleAppender from './appenders/ConsoleAppender';
import FileAppender from './appenders/FileAppender';
import AppenderConfiguration from './config/AppenderConfiguration';
import Configuration from './config/Configuration';
import ConsoleAppenderConfiguration from './config/ConsoleAppenderConfiguration';
import FileAppenderConfiguration from './config/FileAppenderConfiguration';
import Appender from './core/Appender';
import Layout from './core/Layout';
import LogLevel from './core/LogLevel';
import LogManager from './core/LogManager';
import Logger from './core/Logger';
import PatternLayout from './core/PatternLayout';

export {
    ConsoleAppender,
    FileAppender,
    AppenderConfiguration,
    Configuration,
    ConsoleAppenderConfiguration,
    FileAppenderConfiguration,
    Appender,
    Layout,
    LogLevel,
    LogManager,
    Logger,
    PatternLayout,
};

import {
    ConfigurationStore,
} from '@t2ee/core';
import * as path from 'path';

ConfigurationStore.provide('LogLevel', LogLevel);
ConfigurationStore.provide('relative', (p: string) => path.resolve(process.cwd(), p));
