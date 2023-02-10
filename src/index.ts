import './api/index';
import dotenv from 'dotenv';
import sodium from 'libsodium-wrappers';
import { ExtendedClient } from './structure/Client';
import { generateKeyPair } from './utils/crypto';

dotenv.config();

export const client = new ExtendedClient();
client.start();

let keys: sodium.KeyPair;
sodium.ready.then(() => {
    keys = generateKeyPair();
});
export { keys };
