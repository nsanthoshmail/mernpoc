import { IUser } from './types/user.interface';
import { logger } from '../../core/utils/logger';
import { v4 as uuidv4 } from 'uuid'; // Example: using UUIDs for IDs

// --- !!! MOCK IMPLEMENTATION - REPLACE WITH ACTUAL DATABASE LOGIC !!! ---
// Use Prisma, TypeORM, Sequelize, MongoDB Driver, etc.
const usersDatabaseMock: Map<string, IUser> = new Map();

export class UsersRepository {
  /**
   * Finds a user by their unique ID.
   * @param id - The user's ID.
   * @returns The user object or null if not found.
   */
  async findById(id: string): Promise<IUser | null> {
    logger.debug(`[UsersRepository] Finding user by id: ${id}`);
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
  async findByEmail(email: string): Promise<IUser | null> {
    const lowerCaseEmail = email.toLowerCase();
    logger.debug(`[UsersRepository] Finding user by email: ${lowerCaseEmail}`);
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
  async create(userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    logger.debug(`[UsersRepository] Creating user with email: ${userData.email}`);
    const newUser: IUser = {
      id: uuidv4(), // Generate a unique ID
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // --- Replace with DB Insert Operation ---
    usersDatabaseMock.set(newUser.id, newUser);
    // -----------------------------------
    logger.info(`[UsersRepository] User created successfully with id: ${newUser.id}`);
    return newUser;
  }

  /**
   * Checks if a user exists with the given email.
   * @param email - The email address to check.
   * @returns True if a user exists, false otherwise.
   */
  async exists(email: string): Promise<boolean> {
     logger.debug(`[UsersRepository] Checking existence for email: ${email}`);
     // --- Replace with DB Count or Exists Query ---
     const user = await this.findByEmail(email);
     // ------------------------------------------
     return !!user;
  }

  // --- Add methods for update, delete, list users as needed ---
  // async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> { ... }
  // async delete(id: string): Promise<boolean> { ... }
  // async findAll(options: { limit: number, offset: number }): Promise<IUser[]> { ... }
}
// --- !!! END MOCK IMPLEMENTATION !!! -