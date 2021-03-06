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
    <a href="https://www.npmjs.com/package/@t2ee/sl4js">
        <img src="https://badge.fury.io/js/%40t2ee%2Fsl4js.svg">
    </a>
    <a href="https://travis-ci.org/t2ee/sl4js">
        <img src="https://img.shields.io/travis/t2ee/sl4js/master.svg?style=flat-square">
    </a>
    <a href="https://coveralls.io/r/t2ee/sl4js?branch=master">
        <img src="https://img.shields.io/coveralls/t2ee/sl4js/master.svg?style=flat-square">
    </a>
</p>

# Introducation

A simple logging library yet with powerful functionalities. Customizable appenders and rich output format. Share configurations through application.

# Installation

`npm i reflect-metadata @t2ee/core @t2ee/sl4js -S`

# Usage

## Basic Example

```yaml
  default: ConsoleDebug
  level: LogLevel.DEBUG
  appenders:
  - name: ConsoleDebug
    appender: console
      pattern: '%d{YYYY-MM-DD HH:mm:ss.SSS} %-7c{[%l]} %10n %5p - %2w  %m'
      level: LogLevel.DEBUG
  - name: FileLog
    appender: file
    pattern: '%d{YYYY-MM-DD HH:mm:ss.SSS} [%l] %10n %5p - %2w  %m'
    level: LogLevel.INFO
    file: relative(file.log)
```

```typescript
ConfigurationStore.loadFile(PATH_TO_LOGGING_CONFIGURATION);
LogManager.getLogger().debug('Hello World');
```

## Custom Appender

```typescript
interface Configuration extends AppenderConfiguration {

}

class ConsoleAppender extends Appender<Configuration> {
    public log(layout: Layout): void {
        let message: string = this.patternLayout.parse(layout);
        console.log(message);
    }
}
```

# Pattern

Pattern refers to what you put in appenders' pattern field, e.g, `'%d{YYYY-MM-DD HH:mm:ss.SSS} %-7c{[%l]} %10n %5p - %2w  %m'`

As you can see in the example, any prefix digit, e.g, `%7d`, `%-7d`, refers to padding, positive means left, vice versa.

As for chacaters(placeholders) supported, see chart below.

character |       usage        | description
----------|--------------------|-------------
d         | `%d`, or `%d{FORMAT}`, FORMAT is a valid (momentjs)[//momentjs.com/] format | it displays the date.
c         | `%c{PATTERN}`, PATTERN is any other valid pattern | composite, it allows to pad multiple patterns all together.
n         | `%n`               | appender name
m         | `%m`               | message
p         | `%p`               | process id
w         | `%w`               | worker id
l         | `%l`               | level
