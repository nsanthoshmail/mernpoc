"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouterModule = void 0;
const express_1 = require("express");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const users_repository_1 = require("./users.repository");
const zod_validation_middleware_1 = require("../../core/middleware/zod-validation.middleware");
const user_schema_1 = require("./schemas/user.schema");
// --- Dependency Instantiation (Manual DI) ---
// In a real app, a DI container (like InversifyJS) would manage this.
const repository = new users_repository_1.UsersRepository();
const service = new users_service_1.UsersService(repository);
const controller = new users_controller_1.UsersController(service);
// ---
const usersRouter = (0, express_1.Router)();
// Define User Routes
// Create User: POST /
usersRouter.post('/', (0, zod_validation_middleware_1.zodValidationMiddleware)(user_schema_1.createUserSchema, 'body'), // Validate request body
controller.createUser);
// Get User by ID: GET /:id
usersRouter.get('/:id', (0, zod_validation_middleware_1.zodValidationMiddleware)(user_schema_1.userIdSchema, 'params'), // Validate route parameters
controller.getUserById);
// --- Add routes for update, delete, list users as needed ---
// usersRouter.put('/:id', zodValidationMiddleware(userIdSchema, 'params'), zodValidationMiddleware(updateUserSchema, 'body'), controller.updateUser);
// usersRouter.delete('/:id', zodValidationMiddleware(userIdSchema, 'params'), controller.deleteUser);
// usersRouter.get('/', controller.listUsers);
// Export an object containing the router and the service instance
// (allowing other modules to inject the UsersService if needed).
exports.usersRouterModule = {
    router: usersRouter,
    service: service,
};
