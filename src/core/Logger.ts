import * as cluster from 'cluster';
import * as process from 'process';

import LogLevel from './LogLevel';
import Appender from './Appender';

class Logger {

    public constructor(private appender: Appender<any>, private level: LogLevel) {
    }

    private log(level: LogLevel, date: Date, ...messages: any[]): void {
        if (level < this.level) {
            return;
        }
        this.appender.log({
            processId: process.pid,
            workerId: cluster.isWorker ? parseInt(cluster.worker.id) : 0,
            name: this.appender.name,
            date,
            level,
            message: messages.join(' '),
        });
    }

    public setLevel(level: LogLevel): void {
        this.level = level;
    }

    public debug(...messages: any[]): void {
        this.log(LogLevel.DEBUG, new Date(), ...messages);
    }

    public trace(...messages: any[]): void {
        this.log(LogLevel.TRACE, new Date(), ...messages);
    }

    public info(...messages: any[]): void {
        this.log(LogLevel.INFO, new Date(), ...messages);
    }

    public warn(...messages: any[]): void {
        this.log(LogLevel.WARN, new Date(), ...messages);
    }

    public error(...messages: any[]): void {
        this.log(LogLevel.ERROR, new Date(), ...messages);
    }

    public fatal(...messages: any[]): void {
        this.log(LogLevel.FATAL, new Date(), ...messages);
    }
}

export default Logger;
