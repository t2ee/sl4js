import PatternLayout from './PatternLayout';
import Layout from './Layout';

abstract class Appender<T> {
    public constructor(protected patternLayout: PatternLayout, private _name: string, protected config: T) {
    }
    // tslint:disable-next-line prefer-function-over-method
    public abstract log(layout: Layout): void;
    public get name(): string {
        return this._name;
    }
}

export default Appender;
