import FileAppender from './FileAppender';
import PatternLayout from '../core/PatternLayout';
import LogLevel from '../core/LogLevel';
import * as colors from 'colors';
import * as path from 'path';
import * as fs from 'fs';
import * as Q from 'q';
import test from 'ava';

test('ConsoleAppender', async t => {
    let currentMessage = null;
    console.log = (message) => {
        currentMessage = message;
    }
    const file = path.resolve(__dirname, '../../test.log');
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
    let appender = new FileAppender(new PatternLayout('%m'), 'console', { name: 'console', appender: 'console', pattern: '%m', level: LogLevel.DEBUG, file });
    appender.log({
        date: null,
        message: 'test',
        level: LogLevel.WARN,
        processId: null,
        workerId: null,
        name: null,
    });
    let content = Q.defer<string>();
    const stream = fs.createReadStream(file);
    stream.on('data', (chunk) => {
        content.resolve(chunk.toString());
    })
    t.is('test\n', await content.promise);
});
