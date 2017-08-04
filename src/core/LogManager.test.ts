import 'reflect-metadata';
import * as path from 'path';
import LogManager from './LogManager';
import {
    ConfigurationStore,
} from '@t2ee/core';
import test from 'ava';

test('LogManager', t => {
    let currentMessage = null;
    console.log = (message) => {
        currentMessage = message;
    }
    ConfigurationStore.loadFile(path.resolve(__dirname, '../../logger'));
    const logger = LogManager.getLogger();
    t.not(logger, null);
});
