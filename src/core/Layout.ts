import LogLevel from './LogLevel';

interface Layout {
    date: Date;
    message: string;
    level: LogLevel;
    processId: number;
    workerId: number;
    name: string;
}

export default Layout;