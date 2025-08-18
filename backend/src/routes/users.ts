import { Router } from 'express';
import { authenticate, requireAdmin, requireOwnershipOrAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { updateUserSchema, createUserSchema, bulkCreateUsersSchema, userQuerySchema } from '../schemas/user';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  bulkCreateUsers,
} from '../controllers/userController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all users (admin only)
router.get('/', requireAdmin, validateRequest({ query: userQuerySchema }), getUsers);

// Create new user (admin only)
router.post('/', requireAdmin, validateRequest({ body: createUserSchema }), createUser);

// Bulk create users (admin only)
router.post('/bulk', requireAdmin, validateRequest({ body: bulkCreateUsersSchema }), bulkCreateUsers);

// Get user by ID (admin or owner)
router.get('/:id', requireOwnershipOrAdmin, getUserById);

// Update user (admin or owner)
router.put('/:id', requireOwnershipOrAdmin, validateRequest({ body: updateUserSchema }), updateUser);

// Delete user (admin only)
router.delete('/:id', requireAdmin, deleteUser);

export default router;