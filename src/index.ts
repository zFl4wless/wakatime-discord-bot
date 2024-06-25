import './api/index';
import dotenv from 'dotenv';
import sodium from 'libsodium-wrappers-sumo';
import { ExtendedClient } from './structure/Client';
import { generateKeyPair } from './utils/crypto';
import { Logger } from 'tslog';

dotenv.config();

export const logger = new Logger();

export const client = new ExtendedClient();
client.start();

let keys: sodium.KeyPair;
sodium.ready.then(() => {
    keys = generateKeyPair();
});
export { keys };
