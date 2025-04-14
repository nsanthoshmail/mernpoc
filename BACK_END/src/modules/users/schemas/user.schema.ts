import { z } from 'zod';

// Schema for validating user creation input
export const createUserSchema = z.object({
  email: z.string({ required_error: 'Email is required' })
          .trim()
          .min(1, { message: 'Email cannot be empty.' })
          .email({ message: 'Invalid email address format.' }),

  password: z.string({ required_error: 'Password is required' })
             .min(8, { message: 'Password must be at least 8 characters.' })
             // Example: Enforce at least one number and one uppercase letter
             .regex(/^(?=.*\d)(?=.*[A-Z]).*$/, { message: 'Password must contain at least one number and one uppercase letter.'}),

  name: z.string()
         .trim()
         .min(1, { message: 'Name cannot be empty if provided.'})
         .max(100, { message: 'Name cannot exceed 100 characters.' })
         .optional(), // Name is optional
});

// Infer the TypeScript type for the validated input data
export type CreateUserDto = z.infer<typeof createUserSchema>;


// Schema for validating user ID in route parameters (assuming UUID)
export const userIdSchema = z.object({
    id: z.string({ required_error: 'User ID parameter is required' })
         .uuid({ message: "Invalid User ID format."}),
});

// Infer the TypeScript type for the validated route parameter
export type UserIdDto = z.infer<typeof userIdSchema>;