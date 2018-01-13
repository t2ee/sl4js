import {
    Component,
    Value,
} from '@t2ee/core';

import LogLevel from '../core/LogLevel';
import AppenderConfiguration from './AppenderConfiguration';

@Component()
class Configuration {
    @Value('appenders', 'logger')
    public appenders: AppenderConfiguration[];

    @Value('default', 'logger')
    public default: string;

    @Value('level', 'logger')
    public level: LogLevel;
}

export default Configuration;
