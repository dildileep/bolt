import { Response } from 'express';
import { prisma } from '../utils/database';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Get all skills
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Skill category
 *     responses:
 *       200:
 *         description: Skills retrieved successfully
 */
export const getSkills = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    sortBy = 'name',
    sortOrder = 'asc'
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  if (category) {
    where.category = category;
  }

  const [skills, total] = await Promise.all([
    prisma.skill.findMany({
      where,
      include: {
        _count: {
          select: {
            userSkills: true,
          },
        },
      },
      skip,
      take: Number(limit),
      orderBy: {
        [sortBy as string]: sortOrder,
      },
    }),
    prisma.skill.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      skills,
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
 * /api/skills/{id}:
 *   get:
 *     summary: Get skill by ID
 *     tags: [Skills]
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
 *         description: Skill retrieved successfully
 *       404:
 *         description: Skill not found
 */
export const getSkillById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const skill = await prisma.skill.findUnique({
    where: { id },
    include: {
      userSkills: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              department: true,
            },
          },
        },
        orderBy: {
          proficiencyLevel: 'desc',
        },
      },
      _count: {
        select: {
          userSkills: true,
        },
      },
    },
  });

  if (!skill) {
    return res.status(404).json({
      success: false,
      message: 'Skill not found',
    });
  }

  res.json({
    success: true,
    data: { skill },
  });
});

/**
 * @swagger
 * /api/skills:
 *   post:
 *     summary: Create new skill
 *     tags: [Skills]
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
 *               - category
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Skill created successfully
 *       409:
 *         description: Skill already exists
 */
export const createSkill = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { name, category, description, tags = [] } = req.body;

  // Check if skill already exists
  const existingSkill = await prisma.skill.findUnique({
    where: { name },
  });

  if (existingSkill) {
    return res.status(409).json({
      success: false,
      message: 'Skill with this name already exists',
    });
  }

  const skill = await prisma.skill.create({
    data: {
      name,
      category,
      description,
      tags,
      createdBy: req.user!.id,
    },
  });

  logger.info(`Skill created: ${skill.name} by ${req.user!.email}`);

  res.status(201).json({
    success: true,
    message: 'Skill created successfully',
    data: { skill },
  });
});

/**
 * @swagger
 * /api/skills/{id}:
 *   put:
 *     summary: Update skill
 *     tags: [Skills]
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
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *       404:
 *         description: Skill not found
 */
export const updateSkill = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const skill = await prisma.skill.update({
    where: { id },
    data: updateData,
  });

  logger.info(`Skill updated: ${skill.name} by ${req.user!.email}`);

  res.json({
    success: true,
    message: 'Skill updated successfully',
    data: { skill },
  });
});

/**
 * @swagger
 * /api/skills/{id}:
 *   delete:
 *     summary: Delete skill (Admin only)
 *     tags: [Skills]
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
 *         description: Skill deleted successfully
 *       404:
 *         description: Skill not found
 */
export const deleteSkill = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const skill = await prisma.skill.delete({
    where: { id },
  });

  logger.info(`Skill deleted: ${skill.name} by ${req.user!.email}`);

  res.json({
    success: true,
    message: 'Skill deleted successfully',
    data: { skill },
  });
});

/**
 * @swagger
 * /api/skills/bulk:
 *   post:
 *     summary: Bulk create skills (Admin only)
 *     tags: [Skills]
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
 *                 - category
 *                 - description
 *               properties:
 *                 name:
 *                   type: string
 *                 category:
 *                   type: string
 *                 description:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *     responses:
 *       200:
 *         description: Bulk skill creation completed
 */
export const bulkCreateSkills = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const skills = req.body;
  const results = {
    success: true,
    processed: skills.length,
    created: 0,
    updated: 0,
    errors: [] as any[],
  };

  for (let i = 0; i < skills.length; i++) {
    try {
      const skillData = skills[i];

      // Check if skill exists
      const existingSkill = await prisma.skill.findUnique({
        where: { name: skillData.name },
      });

      if (existingSkill) {
        // Update existing skill
        await prisma.skill.update({
          where: { id: existingSkill.id },
          data: {
            ...skillData,
            createdBy: req.user!.id,
          },
        });
        results.updated++;
      } else {
        // Create new skill
        await prisma.skill.create({
          data: {
            ...skillData,
            createdBy: req.user!.id,
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

  logger.info(`Bulk skill creation: ${results.created} created, ${results.updated} updated, ${results.errors.length} errors by ${req.user!.email}`);

  res.json({
    success: true,
    message: 'Bulk skill creation completed',
    data: results,
  });
});

/**
 * @swagger
 * /api/skills/user/{userId}:
 *   get:
 *     summary: Get user skills
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User skills retrieved successfully
 */
export const getUserSkills = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;

  const userSkills = await prisma.userSkill.findMany({
    where: { userId },
    include: {
      skill: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  res.json({
    success: true,
    data: { userSkills },
  });
});

/**
 * @swagger
 * /api/skills/user/{userId}/{skillId}:
 *   put:
 *     summary: Update user skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - proficiencyLevel
 *             properties:
 *               proficiencyLevel:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: User skill updated successfully
 */
export const updateUserSkill = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId, skillId } = req.params;
  const { proficiencyLevel, notes } = req.body;

  // Check if user can update this skill (admin or owner)
  if (req.user!.role !== 'ADMIN' && req.user!.id !== userId) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own skills',
    });
  }

  const userSkill = await prisma.userSkill.upsert({
    where: {
      userId_skillId: {
        userId,
        skillId,
      },
    },
    update: {
      proficiencyLevel,
      notes,
      assessedBy: req.user!.id,
    },
    create: {
      userId,
      skillId,
      proficiencyLevel,
      notes,
      assessedBy: req.user!.id,
    },
    include: {
      skill: true,
    },
  });

  logger.info(`User skill updated: ${userSkill.skill.name} for user ${userId} by ${req.user!.email}`);

  res.json({
    success: true,
    message: 'User skill updated successfully',
    data: { userSkill },
  });
});

/**
 * @swagger
 * /api/skills/user/{userId}/{skillId}:
 *   delete:
 *     summary: Delete user skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User skill deleted successfully
 */
export const deleteUserSkill = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId, skillId } = req.params;

  // Check if user can delete this skill (admin or owner)
  if (req.user!.role !== 'ADMIN' && req.user!.id !== userId) {
    return res.status(403).json({
      success: false,
      message: 'You can only delete your own skills',
    });
  }

  const userSkill = await prisma.userSkill.delete({
    where: {
      userId_skillId: {
        userId,
        skillId,
      },
    },
    include: {
      skill: true,
    },
  });

  logger.info(`User skill deleted: ${userSkill.skill.name} for user ${userId} by ${req.user!.email}`);

  res.json({
    success: true,
    message: 'User skill deleted successfully',
    data: { userSkill },
  });
});