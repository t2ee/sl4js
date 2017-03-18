import AppenderConfiguration from './AppenderConfiguration';

interface FileAppenderConfiguration extends AppenderConfiguration {
    file: string;
}

export default FileAppenderConfiguration;
