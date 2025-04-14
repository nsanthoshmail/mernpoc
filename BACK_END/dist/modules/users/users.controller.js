"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const logger_1 = require("../../core/utils/logger");
/**
 * Controller handling HTTP requests related to users.
 */
class UsersController {
    // Dependency Injection via constructor
    constructor(usersService) {
        this.usersService = usersService;
        /**
         * Handles POST /users requests to create a new user.
         * Relies on validation middleware to populate req.validatedBody.
         */
        this.createUser = async (req, res, next) => {
            // Data is assumed to be validated and attached by zodValidationMiddleware
            const createUserDto = req.validatedBody;
            logger_1.logger.info(`[UsersController] Handling request to create user: ${createUserDto?.email}`);
            try {
                const newUserResponse = await this.usersService.createUser(createUserDto);
                logger_1.logger.info(`[UsersController] User creation successful: ${newUserResponse.id}`);
                res.status(201).json(newUserResponse);
            }
            catch (error) {
                logger_1.logger.error(`[UsersController] Error during user creation: ${error}`);
                next(error); // Pass error to the global error handler
            }
        };
        /**
         * Handles GET /users/:id requests to retrieve a user by ID.
         * Relies on validation middleware to populate req.validatedParams.
         */
        this.getUserById = async (req, res, next) => {
            // Params assumed to be validated and attached by zodValidationMiddleware
            const { id } = req.validatedParams; // Type assertion
            logger_1.logger.info(`[UsersController] Handling request to get user by id: ${id}`);
            try {
                const userResponse = await this.usersService.findUserById(id);
                logger_1.logger.info(`[UsersController] User retrieval successful: ${userResponse.id}`);
                res.status(200).json(userResponse);
            }
            catch (error) {
                logger_1.logger.error(`[UsersController] Error retrieving user by id ${id}: ${error}`);
                next(error); // Pass error to the global error handler
            }
        };
    }
}
exports.UsersController = UsersController;
