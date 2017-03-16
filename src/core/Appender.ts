import LogLevel from './LogLevel';
import PatternLayout from './PatternLayout';
import Layout from './Layout';

abstract class Appender<T> {
    constructor(protected patternLayout: PatternLayout, private _name: string, protected config: T) {
    }
    abstract log(layout: Layout): void 
    get name(): string {
        return this._name;
    }
}

export default Appender;