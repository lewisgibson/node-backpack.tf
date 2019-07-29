require('dotenv').config({ path: require('path').join(__dirname, '../.env.test') });

import BackpackTF from '../src';
import Crypto from 'crypto';

let MockClientID: string;
let MockClientSecret: string;

beforeAll(() => {
    const Rnd = Crypto.randomBytes(12);
    MockClientID = Rnd.toString('hex');
    MockClientSecret = Rnd.toString('base64');
});

describe('OAuth Class', () => {
    /**
     * Begin Unit Tests
     */
    test('Invalid ClientID', () => {
        expect(() => new BackpackTF.OAuth('', MockClientSecret)).toThrow();
    });

    test('Invalid ClientSecret', () => {
        expect(() => new BackpackTF.OAuth(MockClientID, '')).toThrow();
    });

    test('Initialises Normally', () => {
        expect(() => new BackpackTF.OAuth(MockClientID, MockClientSecret)).not.toThrow();
    });

    /**
     * Begin Integration Tests
     */
    test('Gets Token', async () => {
        const Instance = new BackpackTF.OAuth(process.env.ClientID as string, process.env.ClientSecret as string);
        const Token = await Instance.GetToken();
        expect(Token).not.toBeUndefined();
    });
});
