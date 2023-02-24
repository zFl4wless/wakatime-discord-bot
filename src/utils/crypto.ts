import sodium from 'libsodium-wrappers';
import fs from 'fs';

/**
 * This utility is used to encrypt and decrypt data using libsodium-wrappers.
 * Credits to DreamTexX for the code :)
 *
 * @returns {sodium.KeyPair} The generated key pair.
 */

/**
 * Generates a key pair used for encryption and decryption.
 *
 * @returns {sodium.KeyPair} The generated key pair.
 */
export function generateKeyPair(): sodium.KeyPair {
    const currentSalt = getSalt();

    let salt: Uint8Array;
    if (currentSalt && currentSalt.length > 0) {
        salt = sodium.from_base64(getSalt());
    } else {
        salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
        saveSalt(sodium.to_base64(salt));
    }

    const hash = sodium.crypto_pwhash(
        sodium.crypto_secretbox_KEYBYTES,
        process.env.CRYPTO_PASSWORD,
        salt,
        sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
        sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
        sodium.crypto_pwhash_ALG_ARGON2ID13,
    );

    return sodium.crypto_box_seed_keypair(hash);
}

/**
 * Encrypts data using the given key pair.
 *
 * @param data The data to encrypt.
 * @param keys The key pair to use for encryption.
 * @returns {nonce: string, chipertext: string} The encrypted data.
 */
export function encrypt(data: string, keys: sodium.KeyPair): { nonce: string; chipertext: string } {
    const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
    const chipertext = sodium.crypto_box_easy(data, nonce, keys.publicKey, keys.privateKey);

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
    const rawNonce = sodium.from_base64(nonce);
    const rawData = sodium.from_base64(data);

    const plaintext = sodium.crypto_box_open_easy(rawData, rawNonce, keys.publicKey, keys.privateKey);

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
 * @returns {string} The salt.
 */
function getSalt(): string {
    try {
        return fs
            .readFileSync('./salt.txt', {
                encoding: 'utf-8',
                flag: 'r',
            })
            .toString();
    } catch (error) {
        fs.writeFileSync('./salt.txt', '');
    }
}

/**
 * Saves the salt to the salt.txt file.
 *
 * @param salt The salt to save.
 */
function saveSalt(salt: string): void {
    fs.writeFileSync('./salt.txt', salt);
}
