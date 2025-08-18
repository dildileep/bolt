import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  projectAssignment: z.string().optional(),
  status: z.enum(['active', 'inactive', 'on_leave']).optional(),
  manager: z.string().optional(),
  phone: z.string().optional(),
});

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'USER']).default('USER'),
  department: z.string().optional(),
  location: z.string().optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  projectAssignment: z.string().optional(),
  status: z.enum(['active', 'inactive', 'on_leave']).default('active'),
  manager: z.string().optional(),
  phone: z.string().optional(),
});

export const bulkCreateUsersSchema = z.array(createUserSchema);

export const userQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  department: z.string().optional(),
  role: z.enum(['ADMIN', 'USER']).optional(),
  status: z.enum(['active', 'inactive', 'on_leave']).optional(),
  sortBy: z.enum(['name', 'email', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});