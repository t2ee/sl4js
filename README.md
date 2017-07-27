# Introducation
> This library is to be used with [@t2ee/core](https://github.com/t2ee/core)

# Usage

> prepare a configuration file and load it (see [@t2ee/core](https://github.com/t2ee/core))

> configuration exmaple

```yaml
  default: ConsoleDebug
  level: LogLevel.DEBUG
  appenders:
  - name: ConsoleDebug
    appender: console
      pattern: '%d{YYYY-MM-DD HH:mm:ss.SSS} %-7c{[%l]} %10n %5p - %2w  %M'
      level: LogLevel.DEBUG
  - name: FileLog
    appender: file
    pattern: '%d{YYYY-MM-DD HH:mm:ss.SSS} [%l] %10n %5p - %2w  %M'
    level: LogLevel.INFO
    file: relative(file.log)
```

```typescript
import {
    ConfigurationStore,
} from '@t2ee/core';
import {
    LogManager,
    Logger,
} from 'sl4js';
ConfigurationStore.loadFile(path_to_logging_configuration);
const consoleLogger: Logger = LogManager.getLogger();
const fileLogger: Logger = LogManager.getLogger('FileLog');
consoleLogger.debug('Hello World');
fileLogger.debug('Yes');
```

# API

## Configuration Format

### default

> refers to the name of an appender to be used as default appender.

### level

> logging level, can be overwritted in appender configurations, values are (in order): DEBUG, TRACE, INFO, WARN, ERROR, FATAL

### appenders

> appender configuration

#### name

> unique name to identify appenders

#### appender

> name of appender to be used (comes with two built-in appenders: console, file)

#### pattern

> logging pattern

symbol | usage
-------|-------
%d     | `%d{FORMAT}` or `%d`, `FORMAT` can be any valid [momentjs](https://github.com/moment/moment/) format.
%m     | message
%l     | log level
%n     | logger name
%p     | process id
%w     | worker id

> padding: number in fornt of symbols, e.g, `%10m`, means 10 characters max, align right. negative number means align left.

