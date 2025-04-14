export interface IUser {
    id: string;             // Unique identifier (e.g., UUID)
    email: string;          // User's email address (unique)
    passwordHash: string;   // Securely hashed password
    name?: string | null;   // Optional user's name
    isActive: boolean;      // Flag indicating if the account is active
    createdAt: Date;        // Timestamp of creation
    updatedAt: Date;        // Timestamp of last update
    // Add other relevant fields: roles, lastLogin, etc.
  }