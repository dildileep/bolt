import { Response } from 'express';
import { prisma } from '../utils/database';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';
import { hashPassword } from '../utils/auth';

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
export const getUsers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const {
    page = 1,
    limit = 10,
    search,
    department,
    role,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  if (department) {
    where.department = department;
  }

  if (role) {
    where.role = role;
  }

  if (status) {
    where.status = status;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        location: true,
        avatar: true,
        projectAssignment: true,
        status: true,
        manager: true,
        phone: true,
        joinDate: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            userSkills: true,
            certifications: true,
            trainings: true,
          },
        },
      },
      skip,
      take: Number(limit),
      orderBy: {
        [sortBy as string]: sortOrder,
      },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      users,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 */
export const getUserById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      location: true,
      avatar: true,
      projectAssignment: true,
      status: true,
      manager: true,
      phone: true,
      joinDate: true,
      createdAt: true,
      updatedAt: true,
      userSkills: {
        include: {
          skill: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      },
      certifications: {
        orderBy: {
          updatedAt: 'desc',
        },
      },
      trainings: {
        orderBy: {
          updatedAt: 'desc',
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.json({
    success: true,
    data: { user },
  });
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               department:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
export const updateUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  // Remove sensitive fields that shouldn't be updated via this endpoint
  delete updateData.passwordHash;
  delete updateData.role; // Role changes should be handled separately

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      location: true,
      avatar: true,
      projectAssignment: true,
      status: true,
      manager: true,
      phone: true,
      joinDate: true,
      updatedAt: true,
    },
  });

  logger.info(`User updated: ${user.email} by ${req.user!.email}`);

  res.json({
    success: true,
    message: 'User updated successfully',
    data: { user },
  });
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
export const deleteUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  // Prevent self-deletion
  if (id === req.user!.id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own account',
    });
  }

  const user = await prisma.user.delete({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  logger.info(`User deleted: ${user.email} by ${req.user!.email}`);

  res.json({
    success: true,
    message: 'User deleted successfully',
    data: { user },
  });
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *               department:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: User already exists
 */
export const createUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { password, ...userData } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email.toLowerCase() },
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists',
    });
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      ...userData,
      email: userData.email.toLowerCase(),
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      location: true,
      avatar: true,
      projectAssignment: true,
      status: true,
      manager: true,
      phone: true,
      joinDate: true,
      createdAt: true,
    },
  });

  logger.info(`User created: ${user.email} by ${req.user!.email}`);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: { user },
  });
});

/**
 * @swagger
 * /api/users/bulk:
 *   post:
 *     summary: Bulk create users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - name
 *                 - email
 *                 - password
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: [ADMIN, USER]
 *                 department:
 *                   type: string
 *                 location:
 *                   type: string
 *     responses:
 *       200:
 *         description: Bulk user creation completed
 */
export const bulkCreateUsers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const users = req.body;
  const results = {
    success: true,
    processed: users.length,
    created: 0,
    updated: 0,
    errors: [] as any[],
  };

  for (let i = 0; i < users.length; i++) {
    try {
      const userData = users[i];
      const { password, ...userInfo } = userData;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userInfo.email.toLowerCase() },
      });

      if (existingUser) {
        // Update existing user
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            ...userInfo,
            email: userInfo.email.toLowerCase(),
          },
        });
        results.updated++;
      } else {
        // Create new user
        const passwordHash = await hashPassword(password);
        await prisma.user.create({
          data: {
            ...userInfo,
            email: userInfo.email.toLowerCase(),
            passwordHash,
          },
        });
        results.created++;
      }
    } catch (error: any) {
      results.errors.push({
        row: i + 1,
        message: error.message,
      });
    }
  }

  logger.info(`Bulk user creation: ${results.created} created, ${results.updated} updated, ${results.errors.length} errors by ${req.user!.email}`);

  res.json({
    success: true,
    message: 'Bulk user creation completed',
    data: results,
  });
});