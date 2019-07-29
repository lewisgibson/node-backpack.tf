require('dotenv').config({ path: require('path').join(__dirname, '../.env.test') });

import BackpackTF from '../src';
import Crypto from 'crypto';

let MockKey: string;

beforeAll(() => {
    MockKey = Crypto.randomBytes(12).toString('hex');
});

describe('WebApi Class', () => {
    /**
     * Begin Unit Tests
     */
    test('Invalid API Key', () => {
        expect(() => new BackpackTF.WebApi(MockKey)).not.toThrow();
    });

    test('Valid API Key', () => {
        expect(() => new BackpackTF.WebApi(MockKey)).not.toThrow();
    });

    /**
     * Begin Integration Tests
     */
});
