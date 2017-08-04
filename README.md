<p align="center">
    <a href="//t2ee.org">
        <img width="200" src="//t2ee.org/img/logos/t2ee.png">
    </a>
</p>
<p align="center">
    <a href="//sl4js.t2ee.org">
        <img width="200" src="//t2ee.org/img/logos/sl4js.png">
    </a>
</p>

<p align="center">
    <a href="https://travis-ci.org/t2ee/sl4js">
        <img src="https://img.shields.io/travis/t2ee/sl4js/master.svg?style=flat-square">
    </a>
    <a href="https://coveralls.io/r/t2ee/sl4js?branch=master">
        <img src="https://img.shields.io/coveralls/t2ee/sl4js/master.svg?style=flat-square">
    </a>
</p>

# Introducation

A simple logging library yet with powerful functionalities. Customizable appenders and rich output format. Share configurations through application.

For detailed introduction and examples, please visit [sl4js.t2ee.org](//sl4js.t2ee.org)


# Installation

`npm i reflect-metadata @t2ee/core @t2ee/sl4js -S`

# Example

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
ConfigurationStore.loadFile(PATH_TO_LOGGING_CONFIGURATION);
LogManager.getLogger().debug('Hello World');
```
