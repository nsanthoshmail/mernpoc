import { Router } from 'express';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { zodValidationMiddleware } from '../../core/middleware/zod-validation.middleware';
import { createUserSchema, userIdSchema } from './schemas/user.schema';

// --- Dependency Instantiation (Manual DI) ---
// In a real app, a DI container (like InversifyJS) would manage this.
const repository = new UsersRepository();
const service = new UsersService(repository);
const controller = new UsersController(service);
// ---

const usersRouter = Router();

// Define User Routes

// Create User: POST /
usersRouter.post(
  '/',
  zodValidationMiddleware(createUserSchema, 'body'), // Validate request body
  controller.createUser
);

// Get User by ID: GET /:id
usersRouter.get(
  '/:id',
  zodValidationMiddleware(userIdSchema, 'params'), // Validate route parameters
  controller.getUserById
);

// --- Add routes for update, delete, list users as needed ---
// usersRouter.put('/:id', zodValidationMiddleware(userIdSchema, 'params'), zodValidationMiddleware(updateUserSchema, 'body'), controller.updateUser);
// usersRouter.delete('/:id', zodValidationMiddleware(userIdSchema, 'params'), controller.deleteUser);
// usersRouter.get('/', controller.listUsers);


// Export an object containing the router and the service instance
// (allowing other modules to inject the UsersService if needed).
export const usersRouterModule = {
  router: usersRouter,
  service: service,
};