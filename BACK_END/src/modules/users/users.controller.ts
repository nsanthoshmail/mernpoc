import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto, UserIdDto } from './schemas/user.schema'; // Zod inferred types
import { logger } from '../../core/utils/logger';

/**
 * Controller handling HTTP requests related to users.
 */
export class UsersController {
  // Dependency Injection via constructor
  constructor(private readonly usersService: UsersService) {}

  /**
   * Handles POST /users requests to create a new user.
   * Relies on validation middleware to populate req.validatedBody.
   */
  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Data is assumed to be validated and attached by zodValidationMiddleware
    const createUserDto: CreateUserDto = req.validatedBody;

    logger.info(`[UsersController] Handling request to create user: ${createUserDto?.email}`);

    try {
      const newUserResponse = await this.usersService.createUser(createUserDto);
      logger.info(`[UsersController] User creation successful: ${newUserResponse.id}`);
      res.status(201).json(newUserResponse);
    } catch (error) {
      logger.error(`[UsersController] Error during user creation: ${error}`);
      next(error); // Pass error to the global error handler
    }
  };

  /**
   * Handles GET /users/:id requests to retrieve a user by ID.
   * Relies on validation middleware to populate req.validatedParams.
   */
  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Params assumed to be validated and attached by zodValidationMiddleware
    const { id } = req.validatedParams as UserIdDto; // Type assertion

    logger.info(`[UsersController] Handling request to get user by id: ${id}`);

    try {
      const userResponse = await this.usersService.findUserById(id);
      logger.info(`[UsersController] User retrieval successful: ${userResponse.id}`);
      res.status(200).json(userResponse);
    } catch (error) {
      logger.error(`[UsersController] Error retrieving user by id ${id}: ${error}`);
      next(error); // Pass error to the global error handler
    }
  };

  // --- Add controller methods for update, delete, list users as needed ---
}