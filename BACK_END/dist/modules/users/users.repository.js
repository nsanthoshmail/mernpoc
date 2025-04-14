"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const logger_1 = require("../../core/utils/logger");
const uuid_1 = require("uuid"); // Example: using UUIDs for IDs
// --- !!! MOCK IMPLEMENTATION - REPLACE WITH ACTUAL DATABASE LOGIC !!! ---
// Use Prisma, TypeORM, Sequelize, MongoDB Driver, etc.
const usersDatabaseMock = new Map();
class UsersRepository {
    /**
     * Finds a user by their unique ID.
     * @param id - The user's ID.
     * @returns The user object or null if not found.
     */
    async findById(id) {
        logger_1.logger.debug(`[UsersRepository] Finding user by id: ${id}`);
        // --- Replace with DB Query ---
        const user = usersDatabaseMock.get(id);
        // --------------------------
        return user || null;
    }
    /**
     * Finds a user by their email address (case-insensitive).
     * @param email - The user's email.
     * @returns The user object or null if not found.
     */
    async findByEmail(email) {
        const lowerCaseEmail = email.toLowerCase();
        logger_1.logger.debug(`[UsersRepository] Finding user by email: ${lowerCaseEmail}`);
        // --- Replace with DB Query (use case-insensitive collation if possible) ---
        for (const user of usersDatabaseMock.values()) {
            if (user.email.toLowerCase() === lowerCaseEmail) {
                return user;
            }
        }
        // -----------------------------------------------------------------------
        return null;
    }
    /**
     * Creates a new user record.
     * @param userData - User data excluding id, createdAt, updatedAt.
     * @returns The newly created user object.
     */
    async create(userData) {
        logger_1.logger.debug(`[UsersRepository] Creating user with email: ${userData.email}`);
        const newUser = {
            id: (0, uuid_1.v4)(), // Generate a unique ID
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        // --- Replace with DB Insert Operation ---
        usersDatabaseMock.set(newUser.id, newUser);
        // -----------------------------------
        logger_1.logger.info(`[UsersRepository] User created successfully with id: ${newUser.id}`);
        return newUser;
    }
    /**
     * Checks if a user exists with the given email.
     * @param email - The email address to check.
     * @returns True if a user exists, false otherwise.
     */
    async exists(email) {
        logger_1.logger.debug(`[UsersRepository] Checking existence for email: ${email}`);
        // --- Replace with DB Count or Exists Query ---
        const user = await this.findByEmail(email);
        // ------------------------------------------
        return !!user;
    }
}
exports.UsersRepository = UsersRepository;
// --- !!! END MOCK IMPLEMENTATION !!! -
