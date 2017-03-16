import {
    Configurable, 
    ConfigField,
} from '@t2ee/configurable';


import AppenderConfiguration from './AppenderConfiguration';
import RootConfiguration from './RootConfiguration';

@Configurable('logger')
class Configuration {
    @ConfigField
    appenders: AppenderConfiguration[];

    @ConfigField
    root: RootConfiguration;
}

export default Configuration;