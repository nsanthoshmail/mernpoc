import bcrypt from 'bcrypt';
import { logger } from './logger'; // Assuming your logger is here

// Retrieve salt rounds from configuration, provide a safe default
const DEFAULT_SALT_ROUNDS = 10;
let saltRounds: number;

try {
  // saltRounds = config.get<number>('security.bcryptSaltRounds');
  saltRounds = 12;
  if (typeof saltRounds !== 'number' || saltRounds < 4 || saltRounds > 31) {
    logger.warn(`Invalid bcryptSaltRounds configured (${saltRounds}). Falling back to default: ${DEFAULT_SALT_ROUNDS}`);
    saltRounds = DEFAULT_SALT_ROUNDS;
  }
} catch (error) {
  logger.warn(`Configuration for 'security.bcryptSaltRounds' not found. Using default: ${DEFAULT_SALT_ROUNDS}`);
  saltRounds = DEFAULT_SALT_ROUNDS;
}

logger.info(`Using bcrypt salt rounds: ${saltRounds}`);

/**
 * Hashes a plaintext password using bcrypt.
 *
 * @param plaintextPassword - The password string to hash.
 * @returns A promise that resolves with the bcrypt hash string.
 * @throws Error if hashing fails.
 */
export const hashPassword = async (plaintextPassword: string): Promise<string> => {
  if (!plaintextPassword) {
    throw new Error('Password cannot be empty.');
  }
  try {
    logger.debug('Hashing password...');
    const hash = await bcrypt.hash(plaintextPassword, saltRounds);
    logger.debug('Password hashed successfully.');
    // Note: The resulting hash includes the salt and algorithm info.
    // Ensure your database column is large enough (VARCHAR(60) or more is typical for bcrypt).
    return hash;
  } catch (error) {
    logger.error('Error hashing password:', error);
    throw new Error('Failed to hash password.'); // Avoid leaking details
  }
};

/**
 * Compares a plaintext password attempt against a stored bcrypt hash.
 *
 * @param plaintextPassword - The password attempt from the user.
 * @param storedHash - The hash string retrieved from the database.
 * @returns A promise that resolves with true if the password matches the hash, false otherwise.
 * @throws Error if comparison fails unexpectedly.
 */
export const comparePassword = async (plaintextPassword: string, storedHash: string): Promise<boolean> => {
  if (!plaintextPassword || !storedHash) {
    logger.warn('Attempted password comparison with empty input or hash.');
    return false; // Or throw an error depending on desired behavior
  }
  try {
    logger.debug('Comparing password against stored hash...');
    const isMatch = await bcrypt.compare(plaintextPassword, storedHash);
    logger.debug(`Password comparison result: ${isMatch}`);
    return isMatch;
  } catch (error) {
    // Log bcrypt errors, but don't necessarily expose them directly
    logger.error('Error comparing password:', error);
    // Depending on the error, you might want to throw or just return false.
    // Returning false is generally safer to prevent information leakage on errors.
    return false;
    // If you need to know about specific errors (e.g., invalid hash format), you could inspect the error object.
    // throw new Error('Failed to compare password.');
  }
};