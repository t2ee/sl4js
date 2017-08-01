import * as moment from 'moment';
import {
    EnumUtil,
} from '@t2ee/core';
import LogLevel from './LogLevel';
import Layout from './Layout';

export interface Pattern {
    key: string;
    padding: number;
    index: number;
    format?: string;
    length: number;
    patterns?: Pattern[];
}

const PLAIN_KEYS: {[key: string]: string} = {
    d: 'date',
    m: 'message',
    n: 'name',
    p: 'processId',
    w: 'workerId',
    l: 'level',
};

const FORMAT_KEYS: {[key: string]: string} = {
    d: 'date',
};

function matchRecursively(line: string, regex: RegExp): RegExpMatchArray[] {
    const result: RegExpMatchArray[] = [];
    while (true) {
        const matched: RegExpMatchArray = line.match(regex);
        if (!matched) {
            break;
        }
        result.push(matched);
        line = line.substr(matched.index + matched[0].length);
    }

    return result;
}

function matchWithFormat(pattern: string, letter: string, key: string): Pattern[] {
    const result: Pattern[] = [];
    matchRecursively(pattern, new RegExp(`%(-?\\d*)${letter}{(.*?)}`, 'i'))
        .forEach((match: RegExpMatchArray) => {
            result.push({
                key,
                padding: parseInt(match[1]) || 0,
                index: match.index,
                format: match[2],
                length: match[0].length,
            });
        });

    return result;
}

function matchPlain(pattern: string, letter: string, key: string): Pattern[] {
    return matchRecursively(pattern, new RegExp(`%(-?\\d*)${letter}`, 'i'))
        .map((match: RegExpMatchArray) => ({
            key,
            padding: parseInt(match[1]) || 0,
            index: match.index,
            length: match[0].length,
        }));
}

function stripText(line: string, patterns: Pattern[]): Pattern[] {
    const result: Pattern[] = [];
    const sorted: Pattern[] = patterns.sort((a: Pattern, b: Pattern) => a.index - b.index);
    let index: number = 0;
    for (const pattern of sorted) {
        result.push({
            key: 'text',
            padding: 0,
            index,
            length: pattern.index - index,
            format: line.substr(index, pattern.index - index),
        });

        index = pattern.length + pattern.index;
    }
    result.push({
        key: 'text',
        index,
        padding: 0,
        length: line.length - index,
        format: line.substr(index),
    });

    return result;
}

function padString(line: string, padding: number): string {
    if (padding === 0) {
        return line;
    }
    if (padding < 0) {
        // tslint:disable-next-line no-magic-numbers
        padding = -padding;

        return line.substr(0, padding) + ' '.repeat(Math.max(padding - line.length, 0));
    } else {
        return ' '.repeat(Math.max(padding - line.length, 0)) + line.substr(0, padding);
    }
}

function matchPatterns(pattern: string): Pattern[] {
    const patterns: Pattern[] = [];
    for (const letter in PLAIN_KEYS) {
        patterns.push(...matchPlain(pattern, letter, PLAIN_KEYS[letter]));
    }
    for (const letter in FORMAT_KEYS) {
        patterns.push(...matchWithFormat(pattern, letter, FORMAT_KEYS[letter]));
    }
    const formatted: Pattern[] = patterns.filter((patternToBeFiltered: Pattern) => !!patternToBeFiltered.format);

    return patterns.filter((patternToBeFiltered: Pattern) => {
        return !formatted.find(
            (formattedPattern: Pattern) => {
                return (
                    formattedPattern.index === patternToBeFiltered.index &&
                    formattedPattern.key === patternToBeFiltered.key &&
                    !patternToBeFiltered.format
                );
            });
    });
}

class PatternLayout {

    private patterns: Pattern[] = [];

    public constructor(private pattern: string) {
        this.patterns  = matchPatterns(pattern);
        const composites: Pattern[] = matchWithFormat(pattern, 'c', 'composite')
            .map((composite: Pattern) => {
                composite.patterns = matchPatterns(composite.format);
                composite.patterns = composite.patterns
                    .concat(stripText(composite.format, composite.patterns))
                    .sort((a: Pattern, b: Pattern) => a.index - b.index);

                return composite;
            });
        this.patterns = this.patterns.filter((patternToBeFiltered: Pattern) => {
            for (const composite of composites) {
                if (
                    (patternToBeFiltered.index > composite.index) &&
                    (patternToBeFiltered.index + patternToBeFiltered.length < composite.index + composite.length)
                ) {
                    return false;
                }
            }

            return true;
        });
        this.patterns.push(...composites);
        this.patterns = this.patterns
            .concat(stripText(pattern, this.patterns))
            .sort((a: Pattern, b: Pattern) => a.index - b.index);
    }

    public parse(layout: Layout, patterns: Pattern[] = this.patterns): string {
        let result: string = '';
        for (const pattern of patterns) {
            let part: string = '';
            if (pattern.key === 'composite') {
                part = this.parse(layout, pattern.patterns);
            } else if (pattern.key === 'text') {
                part = pattern.format;
            } else if (pattern.key === 'date' && pattern.format) {
                part = moment(layout.date).format(pattern.format);
            } else if (pattern.key === 'level') {
                part = EnumUtil.toString(LogLevel, layout.level);
            } else {
                part = layout[pattern.key];
            }
            result += padString(part.toString(), pattern.padding);
        }

        return result;
    }
}

export default PatternLayout;
