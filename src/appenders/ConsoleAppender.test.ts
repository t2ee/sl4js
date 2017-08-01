import ConsoleAppender from './ConsoleAppender';
import PatternLayout from '../core/PatternLayout';
import LogLevel from '../core/LogLevel';
import * as colors from 'colors';
import test from 'ava';

test('ConsoleAppender', t => {
    let currentMessage = null;
    console.log = (message) => {
        currentMessage = message;
    }
    const appender = new ConsoleAppender(new PatternLayout('%m'), 'console', { name: 'console', appender: 'console', pattern: '%m', level: LogLevel.DEBUG });
    appender.log({
        date: null,
        message: 'test',
        level: LogLevel.DEBUG,
        processId: null,
        workerId: null,
        name: null,
    });
    t.is(currentMessage, colors.blue('test'));
    appender.log({
        date: null,
        message: 'test',
        level: LogLevel.TRACE,
        processId: null,
        workerId: null,
        name: null,
    });
    t.is(currentMessage, colors.grey('test'));
    appender.log({
        date: null,
        message: 'test',
        level: LogLevel.INFO,
        processId: null,
        workerId: null,
        name: null,
    });
    t.is(currentMessage, colors.cyan('test'));
    appender.log({
        date: null,
        message: 'test',
        level: LogLevel.WARN,
        processId: null,
        workerId: null,
        name: null,
    });
    t.is(currentMessage, colors.yellow('test'));
    appender.log({
        date: null,
        message: 'test',
        level: LogLevel.ERROR,
        processId: null,
        workerId: null,
        name: null,
    });
    t.is(currentMessage, colors.red('test'));
    appender.log({
        date: null,
        message: 'test',
        level: LogLevel.FATAL,
        processId: null,
        workerId: null,
        name: null,
    });
    t.is(currentMessage, colors.bgRed.white('test'));
    t.is(appender.name, 'console');
});
