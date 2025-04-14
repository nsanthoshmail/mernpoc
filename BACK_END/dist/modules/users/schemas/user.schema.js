"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
// Schema for validating user creation input
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string({ required_error: 'Email is required' })
        .trim()
        .min(1, { message: 'Email cannot be empty.' })
        .email({ message: 'Invalid email address format.' }),
    password: zod_1.z.string({ required_error: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters.' })
        // Example: Enforce at least one number and one uppercase letter
        .regex(/^(?=.*\d)(?=.*[A-Z]).*$/, { message: 'Password must contain at least one number and one uppercase letter.' }),
    name: zod_1.z.string()
        .trim()
        .min(1, { message: 'Name cannot be empty if provided.' })
        .max(100, { message: 'Name cannot exceed 100 characters.' })
        .optional(), // Name is optional
});
// Schema for validating user ID in route parameters (assuming UUID)
exports.userIdSchema = zod_1.z.object({
    id: zod_1.z.string({ required_error: 'User ID parameter is required' })
        .uuid({ message: "Invalid User ID format." }),
});
