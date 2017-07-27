import {
    Component,
    Value,
} from '@t2ee/core';

import LogLevel from '../core/LogLevel';
import AppenderConfiguration from './AppenderConfiguration';

@Component
class Configuration {
    @Value('appenders', 'logger', true)
    public appenders: AppenderConfiguration[];

    @Value('default', 'logger', true)
    public default: string;

    @Value('level', 'logger', true)
    public level: LogLevel;
}

export default Configuration;
