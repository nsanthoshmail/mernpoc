"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const user_response_dto_1 = require("./dto/user.response.dto");
const http_exception_1 = require("../../core/errors/http-exception");
const logger_1 = require("../../core/utils/logger");
const hash_utils_1 = require("../../core/utils/hash.utils"); // Use your actual hashing function
/**
 * Service responsible for user-related business logic.
 */
class UsersService {
    // Dependency Injection via constructor
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    /**
     * Creates a new user after validation and password hashing.
     * @param createUserDto - Validated user creation data.
     * @returns The created user data (excluding sensitive fields).
     * @throws HttpException if email already exists.
     */
    async createUser(createUserDto) {
        logger_1.logger.debug(`[UsersService] Service creating user: ${createUserDto.email}`);
        // 1. Check if user already exists
        const emailExists = await this.usersRepository.exists(createUserDto.email);
        if (emailExists) {
            logger_1.logger.warn(`[UsersService] Attempted to create user with existing email: ${createUserDto.email}`);
            throw new http_exception_1.HttpException(409, 'An account with this email address already exists.');
        }
        // 2. Hash the password securely
        const hashedPassword = await (0, hash_utils_1.hashPassword)(createUserDto.password);
        logger_1.logger.debug(`[UsersService] Password hashed successfully for: ${createUserDto.email}`);
        // 3. Prepare user data for repository
        const newUserInput = {
            email: createUserDto.email.toLowerCase(), // Store email consistently
            passwordHash: hashedPassword,
            name: createUserDto.name,
            isActive: true, // Default to active, consider email verification flow later
        };
        // 4. Create user via repository
        const createdUser = await this.usersRepository.create(newUserInput);
        logger_1.logger.info(`[UsersService] User successfully created in repository: ${createdUser.id}`);
        // 5. Return safe response DTO
        return user_response_dto_1.UserResponseDto.fromUser(createdUser);
    }
    /**
     * Finds a user by their ID.
     * @param id - The user's ID (validated).
     * @returns The user data (excluding sensitive fields).
     * @throws NotFoundException if user is not found.
     */
    async findUserById(id) {
        logger_1.logger.debug(`[UsersService] Service finding user by id: ${id}`);
        const user = await this.usersRepository.findById(id);
        if (!user) {
            logger_1.logger.warn(`[UsersService] User not found for id: ${id}`);
            throw new http_exception_1.NotFoundException(`User with ID '${id}' was not found.`);
        }
        logger_1.logger.debug(`[UsersService] User found: ${user.id}`);
        return user_response_dto_1.UserResponseDto.fromUser(user);
    }
    /**
     * Finds a user by email (primarily for internal use like authentication).
     * @param email - The user's email address.
     * @returns The full IUser object (including passwordHash) or null.
     */
    async findUserByEmailInternal(email) {
        logger_1.logger.debug(`[UsersService] Service finding user internally by email: ${email}`);
        return this.usersRepository.findByEmail(email);
    }
}
exports.UsersService = UsersService;
