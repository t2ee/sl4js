import * as moment from 'moment';
import {
    utils,
} from '@t2ee/core';
import LogLevel from './LogLevel';
import Layout from './Layout';

interface Pattern {
    key: string;
    padding: number;
    index: number;
    format?: string;
    length: number;
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

class PatternLayout {

    private patterns: Pattern[] = [];

    constructor(private pattern: string) {
        for (const letter in PLAIN_KEYS) {
            this.patterns.push(...matchPlain(pattern, letter, PLAIN_KEYS[letter]));
        }
        for (const letter in FORMAT_KEYS) {
            this.patterns.push(...matchWithFormat(pattern, letter, FORMAT_KEYS[letter]));
        }
        const formatted = this.patterns.filter(pattern => !!pattern.format);
        this.patterns = this.patterns.filter(pattern =>
            !formatted.find(
                formattedPattern =>
                    formattedPattern.index === pattern.index &&
                    formattedPattern.key === pattern.key &&
                    !pattern.format
            )
        )
        this.patterns = this.patterns.concat(stripText(pattern, this.patterns)).sort((a, b) => a.index - b.index);
    }

    parse(layout: Layout): string {
        let result = '';
        for (const pattern of this.patterns) {
            let part = '';
            if (pattern.key === 'text') {
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