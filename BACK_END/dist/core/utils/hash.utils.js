"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = require("./logger"); // Assuming your logger is here
// Retrieve salt rounds from configuration, provide a safe default
const DEFAULT_SALT_ROUNDS = 10;
let saltRounds;
try {
    // saltRounds = config.get<number>('security.bcryptSaltRounds');
    saltRounds = 12;
    if (typeof saltRounds !== 'number' || saltRounds < 4 || saltRounds > 31) {
        logger_1.logger.warn(`Invalid bcryptSaltRounds configured (${saltRounds}). Falling back to default: ${DEFAULT_SALT_ROUNDS}`);
        saltRounds = DEFAULT_SALT_ROUNDS;
    }
}
catch (error) {
    logger_1.logger.warn(`Configuration for 'security.bcryptSaltRounds' not found. Using default: ${DEFAULT_SALT_ROUNDS}`);
    saltRounds = DEFAULT_SALT_ROUNDS;
}
logger_1.logger.info(`Using bcrypt salt rounds: ${saltRounds}`);
/**
 * Hashes a plaintext password using bcrypt.
 *
 * @param plaintextPassword - The password string to hash.
 * @returns A promise that resolves with the bcrypt hash string.
 * @throws Error if hashing fails.
 */
const hashPassword = async (plaintextPassword) => {
    if (!plaintextPassword) {
        throw new Error('Password cannot be empty.');
    }
    try {
        logger_1.logger.debug('Hashing password...');
        const hash = await bcrypt_1.default.hash(plaintextPassword, saltRounds);
        logger_1.logger.debug('Password hashed successfully.');
        // Note: The resulting hash includes the salt and algorithm info.
        // Ensure your database column is large enough (VARCHAR(60) or more is typical for bcrypt).
        return hash;
    }
    catch (error) {
        logger_1.logger.error('Error hashing password:', error);
        throw new Error('Failed to hash password.'); // Avoid leaking details
    }
};
exports.hashPassword = hashPassword;
/**
 * Compares a plaintext password attempt against a stored bcrypt hash.
 *
 * @param plaintextPassword - The password attempt from the user.
 * @param storedHash - The hash string retrieved from the database.
 * @returns A promise that resolves with true if the password matches the hash, false otherwise.
 * @throws Error if comparison fails unexpectedly.
 */
const comparePassword = async (plaintextPassword, storedHash) => {
    if (!plaintextPassword || !storedHash) {
        logger_1.logger.warn('Attempted password comparison with empty input or hash.');
        return false; // Or throw an error depending on desired behavior
    }
    try {
        logger_1.logger.debug('Comparing password against stored hash...');
        const isMatch = await bcrypt_1.default.compare(plaintextPassword, storedHash);
        logger_1.logger.debug(`Password comparison result: ${isMatch}`);
        return isMatch;
    }
    catch (error) {
        // Log bcrypt errors, but don't necessarily expose them directly
        logger_1.logger.error('Error comparing password:', error);
        // Depending on the error, you might want to throw or just return false.
        // Returning false is generally safer to prevent information leakage on errors.
        return false;
        // If you need to know about specific errors (e.g., invalid hash format), you could inspect the error object.
        // throw new Error('Failed to compare password.');
    }
};
exports.comparePassword = comparePassword;
