import { z } from 'zod';

// Name: 20–60 characters
// Address: max 400 characters
// Password: 8–16 characters, 1 uppercase, 1 special character
// Email: valid format

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;

export const RegisterUserSchema = z.object({
  name: z.string().min(20, 'Name must be at least 20 characters').max(60, 'Name cannot exceed 60 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password cannot exceed 16 characters')
    .regex(passwordRegex, 'Password must contain at least one uppercase letter and one special character'),
  address: z.string().max(400, 'Address cannot exceed 400 characters'),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const UpdatePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .max(16)
    .regex(passwordRegex, 'Password must contain at least one uppercase letter and one special character'),
});

export const CreateUserSchema = RegisterUserSchema.extend({
  role: z.enum(['ADMIN', 'USER', 'STORE_OWNER']),
});

export const CreateStoreSchema = z.object({
  name: z.string().min(1, 'Store name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().max(400, 'Address cannot exceed 400 characters'),
  ownerId: z.string().uuid('Invalid owner ID'),
});

export const RatingSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
});
