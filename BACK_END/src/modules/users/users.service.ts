import { UsersRepository } from './users.repository';
import { UserResponseDto } from './dto/user.response.dto';
import { IUser } from './types/user.interface';
import { HttpException, NotFoundException } from '../../core/errors/http-exception';
import { logger } from '../../core/utils/logger';
import { hashPassword } from '../../core/utils/hash.utils' // Use your actual hashing function
import { CreateUserDto } from './schemas/user.schema'; // Zod inferred type

/**
 * Service responsible for user-related business logic.
 */
export class UsersService {
  // Dependency Injection via constructor
  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   * Creates a new user after validation and password hashing.
   * @param createUserDto - Validated user creation data.
   * @returns The created user data (excluding sensitive fields).
   * @throws HttpException if email already exists.
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    logger.debug(`[UsersService] Service creating user: ${createUserDto.email}`);

    // 1. Check if user already exists
    const emailExists = await this.usersRepository.exists(createUserDto.email);
    if (emailExists) {
      logger.warn(`[UsersService] Attempted to create user with existing email: ${createUserDto.email}`);
      throw new HttpException(409, 'An account with this email address already exists.');
    }

    // 2. Hash the password securely
    const hashedPassword = await hashPassword(createUserDto.password);
    logger.debug(`[UsersService] Password hashed successfully for: ${createUserDto.email}`);

    // 3. Prepare user data for repository
    const newUserInput: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'> = {
      email: createUserDto.email.toLowerCase(), // Store email consistently
      passwordHash: hashedPassword,
      name: createUserDto.name,
      isActive: true, // Default to active, consider email verification flow later
    };

    // 4. Create user via repository
    const createdUser = await this.usersRepository.create(newUserInput);
    logger.info(`[UsersService] User successfully created in repository: ${createdUser.id}`);

    // 5. Return safe response DTO
    return UserResponseDto.fromUser(createdUser);
  }

  /**
   * Finds a user by their ID.
   * @param id - The user's ID (validated).
   * @returns The user data (excluding sensitive fields).
   * @throws NotFoundException if user is not found.
   */
  async findUserById(id: string): Promise<UserResponseDto> {
    logger.debug(`[UsersService] Service finding user by id: ${id}`);
    const user = await this.usersRepository.findById(id);

    if (!user) {
      logger.warn(`[UsersService] User not found for id: ${id}`);
      throw new NotFoundException(`User with ID '${id}' was not found.`);
    }

    logger.debug(`[UsersService] User found: ${user.id}`);
    return UserResponseDto.fromUser(user);
  }

  /**
   * Finds a user by email (primarily for internal use like authentication).
   * @param email - The user's email address.
   * @returns The full IUser object (including passwordHash) or null.
   */
  async findUserByEmailInternal(email: string): Promise<IUser | null> {
    logger.debug(`[UsersService] Service finding user internally by email: ${email}`);
    return this.usersRepository.findByEmail(email);
  }

  // --- Add service methods for update, delete, list users as needed ---
}