import sodium from 'libsodium-wrappers';
import fs from 'fs';

/**
 * This utility is used to encrypt and decrypt data using libsodium-wrappers.
 * Credits to DreamTexX for the code :)
 *
 * Info: You need to create a salt.txt file in the root directory of the project.
 *
 * @returns {sodium.KeyPair} The generated key pair.
 */

/**
 * Generates a key pair used for encryption and decryption.
 *
 * @returns {sodium.KeyPair} The generated key pair.
 */
export function generateKeyPair(): sodium.KeyPair {
    let salt: Uint8Array;
    if (getSalt()) {
        salt = sodium.from_base64(getSalt());
    } else {
        salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
        saveSalt(sodium.to_base64(salt));
    }

    let hash = sodium.crypto_pwhash(
        sodium.crypto_secretbox_KEYBYTES,
        process.env.CRYPTO_PASSWORD,
        salt,
        sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
        sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
        sodium.crypto_pwhash_ALG_ARGON2ID13,
    );

    let key = sodium.crypto_box_seed_keypair(hash);

    return key;
}

/**
 * Encrypts data using the given key pair.
 *
 * @param data The data to encrypt.
 * @param keys The key pair to use for encryption.
 * @returns {nonce: string, chipertext: string} The encrypted data.
 */
export function encrypt(data: string, keys: sodium.KeyPair): { nonce: string; chipertext: string } {
    let nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
    let chipertext = sodium.crypto_box_easy(data, nonce, keys.publicKey, keys.privateKey);

    return {
        nonce: sodium.to_base64(nonce),
        chipertext: sodium.to_base64(chipertext),
    };
}

/**
 * Decrypts data using the given key pair.
 *
 * @param data The data to decrypt.
 * @param nonce The nonce used for encryption.
 * @param keys The key pair to use for decryption.
 * @returns {string} The decrypted data.
 */
export function decrypt(data: string, nonce: string, keys: sodium.KeyPair): string {
    let rawNonce = sodium.from_base64(nonce);
    let rawData = sodium.from_base64(data);

    let plaintext = sodium.crypto_box_open_easy(rawData, rawNonce, keys.publicKey, keys.privateKey);

    return sodium.to_string(plaintext);
}

/**
 * Formats the nonce and chipertext into a string.
 *
 * @param nonce The nonce.
 * @param chipertext The chipertext.
 * @returns {string} The formatted string.
 */
export function formatNonceAndChipertext(nonce: string, chipertext: string): string {
    return `${nonce}$${chipertext}`;
}

/**
 * Gets the salt from the salt.txt file.
 *
 * @returns {string | null} The salt.
 */
function getSalt(): string | null {
    fs.readFile('../../salt.txt', (error, data) => {
        if (error) {
            return null;
        }
        return data;
    });

    return null;
}

/**
 * Saves the salt to the salt.txt file.
 *
 * @param salt The salt to save.
 */
function saveSalt(salt: string): void {
    fs.writeFile('../../salt.txt', salt, (error) => {
        if (error) {
            throw error;
        }
    });
}
