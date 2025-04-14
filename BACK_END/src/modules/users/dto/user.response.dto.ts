import { IUser } from '../types/user.interface';

/**
 * Data Transfer Object for user responses.
 * Excludes sensitive information like passwordHash.
 * Ensures a consistent structure for user data returned by the API.
 */
export class UserResponseDto {
  id: string;
  email: string;
  name?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: IUser) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  /**
   * Static factory method to create a DTO instance from a user object.
   * @param user - The user object (IUser).
   * @returns A UserResponseDto instance.
   */
  static fromUser(user: IUser): UserResponseDto {
    return new UserResponseDto(user);
  }

  /**
   * Static factory method to create an array of DTO instances from user objects.
   * @param users - An array of user objects (IUser[]).
   * @returns An array of UserResponseDto instances.
   */
  static fromUsers(users: IUser[]): UserResponseDto[] {
    return users.map(user => new UserResponseDto(user));
  }
}