import {
    Configurable,
    ConfigField,
} from '@t2ee/configurable';


import AppenderConfiguration from './AppenderConfiguration';
import RootConfiguration from './RootConfiguration';

@Configurable('logger')
class Configuration {
    @ConfigField
    public appenders: AppenderConfiguration[];

    @ConfigField
    public root: RootConfiguration;
}

export default Configuration;
