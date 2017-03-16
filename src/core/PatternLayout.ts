import * as moment from 'moment';
import {
    utils,
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

const PLAIN_KEYS = {
    'd': 'date',
    'm': 'message',
    'n': 'name',
    'p': 'processId',
    'w': 'workerId',
    'l': 'level',
}

const FORMAT_KEYS = {
    'd': 'date',
}

function matchRecursively(string: string, regex: RegExp): RegExpMatchArray[] {
    const result = [];
    while (true) {
        const matched = string.match(regex);
        if (!matched) break;
        result.push(matched);
        string = string.substr(matched.index + matched[0].length);
    }
    return result;
}

function matchWithFormat(pattern: string, letter: string, key: string): Pattern[] {
    const result: Pattern[] = [];
    const regex = /s/;
    matchRecursively(pattern, new RegExp(`%(-?\\d*)${letter}{(.*?)}`, 'i'))
        .forEach(match => {
            result.push({
                key,
                padding: parseInt(match[1]) || 0,
                index: match.index,
                format: match[2],
                length: match[0].length,
            })
        });
    return result;
}

function matchPlain(pattern: string, letter: string, key: string): Pattern[] {
    return matchRecursively(pattern, new RegExp(`%(-?\\d*)${letter}`, 'i'))
        .map(match => ({
                key,
                padding: parseInt(match[1]) || 0,
                index: match.index,
                length: match[0].length,
            }));
}

function stripText(string: string, patterns: Pattern[]): Pattern[] {
    const result = [];
    const sorted = patterns.sort((a, b) => a.index - b.index);
    let index = 0;
    for (const pattern of sorted) {
        result.push({
            key: 'text',
            index,
            length: pattern.index - index,
            format: string.substr(index, pattern.index - index),
        })  
        index = pattern.length + pattern.index;
    }
    result.push({
        key: 'text',
        index,
        length: string.length - index,
        format: string.substr(index),
    });
    return result;
}



function padString(string: string, padding: number): string {
    if (padding === 0) return string;
    if (padding < 0) {
        padding = -padding;
        return string.substr(0, padding) + ' '.repeat(Math.max(padding - string.length, 0));
    } else {
        return ' '.repeat(Math.max(padding - string.length, 0)) + string.substr(0, padding);
    }
}

function matchPatterns(pattern: string): Pattern[] {
    const patterns = [];
    for (const letter in PLAIN_KEYS) {
        patterns.push(...matchPlain(pattern, letter, PLAIN_KEYS[letter]));
    }
    for (const letter in FORMAT_KEYS) {
        patterns.push(...matchWithFormat(pattern, letter, FORMAT_KEYS[letter]));
    }
    const formatted = patterns.filter(pattern => !!pattern.format);
    return patterns.filter(pattern =>
        !formatted.find(
            formattedPattern =>
                formattedPattern.index === pattern.index &&
                formattedPattern.key === pattern.key &&
                !pattern.format
        )
    )
}

class PatternLayout {

    private patterns: Pattern[] = [];

    constructor(private pattern: string) {
        this.patterns  = matchPatterns(pattern); 
        const composites = matchWithFormat(pattern, 'c', 'composite')
            .map(composite => {
                composite.patterns = matchPatterns(composite.format);
                composite.patterns = composite.patterns
                    .concat(stripText(composite.format, composite.patterns)).sort((a, b) => a.index - b.index);
                return composite;
            })
        this.patterns = this.patterns.filter(pattern => {
            for (const composite of composites) {
                if (
                    (pattern.index > composite.index) &&
                    (pattern.index + pattern.length < composite.index + composite.length)
                ) {
                    return false;
                }
            }
            return true;
        });
        this.patterns.push(...composites);
        this.patterns = this.patterns.concat(stripText(pattern, this.patterns)).sort((a, b) => a.index - b.index);
    }

    parse(layout: Layout, patterns: Pattern[] = this.patterns): string {
        let result = '';
        for (const pattern of patterns) {
            let part = '';
            if (pattern.key === 'composite') {
                part = this.parse(layout, pattern.patterns);
            } else if (pattern.key === 'text') {
                part = pattern.format;
            } else if (pattern.key === 'date' && pattern.format) {
                part = moment(layout.date).format(pattern.format);
            } else if (pattern.key === 'level') {
                part = utils.EnumUtil.toString(LogLevel, layout.level);
            } else {
                part = layout[pattern.key];
            }
            result += padString(part.toString(), pattern.padding);
        }
        return result;
    }
}

export default PatternLayout;