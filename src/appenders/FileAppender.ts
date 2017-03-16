import * as fs from 'fs';

import Appender from '../core/Appender';
import Layout from '../core/Layout';
import FileAppenderConfiguration from '../config/FileAppenderConfiguration';


class FileAppender extends Appender<FileAppenderConfiguration> {
    private stream: fs.WriteStream;

    log(layout: Layout): void {
        if (!this.stream) {
            this.stream = fs.createWriteStream(this.config.file, { flags: 'a' });
        }
        let message = this.patternLayout.parse(layout);
        this.stream.write(message + '\n');
    }
}

export default FileAppender;