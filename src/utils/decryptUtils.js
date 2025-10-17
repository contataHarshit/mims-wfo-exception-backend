import crypto from "crypto";
import logger from "./logger.js";
/**
 * Derives key and IV from password and salt using OpenSSL EVP_BytesToKey method
 * @param {Buffer} password - password as Buffer
 * @param {Buffer} salt - salt as Buffer (8 bytes)
 * @param {number} keyLen - desired key length in bytes (e.g. 32 for AES-256)
 * @param {number} ivLen - desired IV length in bytes (e.g. 16)
 * @returns {{key: Buffer, iv: Buffer}} - derived key and IV
 */
function evpBytesToKey(password, salt, keyLen, ivLen) {
  let data = Buffer.concat([password, salt]);
  let md5 = crypto.createHash("md5").update(data).digest();
  let key = md5;
  let prev = md5;

  while (key.length < keyLen + ivLen) {
    prev = crypto
      .createHash("md5")
      .update(Buffer.concat([prev, password, salt]))
      .digest();
    key = Buffer.concat([key, prev]);
  }

  return {
    key: key.slice(0, keyLen),
    iv: key.slice(keyLen, keyLen + ivLen),
  };
}

/**
 * Decrypts OpenSSL-style AES-256-CBC encrypted data (with Salted__ prefix)
 * Logs key, ciphertext, decrypted value and errors
 * @param {string} encryptedBase64 - base64 encoded encrypted text
 * @param {string} passwordBase64 - base64 encoded encryption key (password)
 * @param {object} logger - logger instance with info and error methods
 * @returns {string} - decrypted plain text
 * @throws {Error} - if input format is invalid or decryption fails
 */
export function decryptOpenSSL(encryptedBase64, passwordBase64) {
  logger.info(`Starting decryption`);
  logger.info(`Encryption Key (base64): ${passwordBase64}`);
  logger.info(`Ciphertext (base64): ${encryptedBase64}`);

  try {
    const encrypted = Buffer.from(encryptedBase64, "base64");

    if (encrypted.slice(0, 8).toString() !== "Salted__") {
      throw new Error("Encrypted data is not in OpenSSL salted format.");
    }

    const salt = encrypted.slice(8, 16);
    const ciphertext = encrypted.slice(16);
    const password = Buffer.from(passwordBase64, "base64");

    const { key, iv } = evpBytesToKey(password, salt, 32, 16);

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);

    const decryptedText = decrypted.toString("utf8");

    logger.info(`Decryption successful. Decrypted value: ${decryptedText}`);

    return decryptedText;
  } catch (error) {
    logger.error(`❌ Decryption failed: ${error.message}`);
    logger.error(`Encryption Key (base64): ${passwordBase64}`);
    logger.error(`Ciphertext (base64): ${encryptedBase64}`);
    throw error;
  }
}
