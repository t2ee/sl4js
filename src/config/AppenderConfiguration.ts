import LogLevel from '../core/LogLevel';

interface AppenderConfiguration {
    name: string;
    appender: string;
    pattern: string; 
    level: LogLevel;
}

export default AppenderConfiguration;