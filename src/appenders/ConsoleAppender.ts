import * as colors from 'colors';
import LogLevel from '../core/LogLevel';
import Appender from '../core/Appender';
import Layout from '../core/Layout';
import ConsoleAppenderConfiguration from '../config/ConsoleAppenderConfiguration';

const FONT_COLORS = {
    [LogLevel.DEBUG]: 'blue',
    [LogLevel.TRACE]: 'grey',
    [LogLevel.INFO]: 'cyan',
    [LogLevel.WARN]: 'yellow',
    [LogLevel.ERROR]: 'red',
}

class ConsoleAppender extends Appender<ConsoleAppenderConfiguration> {
    log(layout: Layout): void {
        let message = this.patternLayout.parse(layout);
        if (layout.level === LogLevel.FATAL) {
            message = colors.bgRed.white(message);
        } else {
            message = colors[FONT_COLORS[layout.level]](message);
        }
        console.log(message);
    }
}

export default ConsoleAppender;