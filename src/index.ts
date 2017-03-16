import * as path from 'path';
import * as process from 'process';

export { default as Appender } from './core/Appender';
export { default as Layout } from './core/Layout';
export { default as Logger } from './core/Logger';
import LogLevel  from './core/LogLevel';
export { default as LogManager } from './core/LogManager';
export { default as PatternLayout } from './core/PatternLayout';

export {
    LogLevel,
};

import {
    ConfigStore,
} from '@t2ee/configurable';

ConfigStore.provide('LogLevel', LogLevel);
ConfigStore.provide('relative', (p) => { return path.resolve(process.cwd(), p) });
