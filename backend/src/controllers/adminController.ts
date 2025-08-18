import { Response } from 'express';
import { prisma } from '../utils/database';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get dashboard statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 */
export const getDashboardStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const [
    totalUsers,
    totalSkills,
    totalCertifications,
    totalTrainings,
    userSkills,
    skillsByCategory,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.skill.count(),
    prisma.certification.count(),
    prisma.training.count(),
    prisma.userSkill.findMany({
      select: {
        proficiencyLevel: true,
      },
    }),
    prisma.skill.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
    }),
  ]);

  const averageSkillLevel = userSkills.length > 0
    ? userSkills.reduce((sum, skill) => sum + skill.proficiencyLevel, 0) / userSkills.length
    : 0;

  const stats = {
    totalUsers,
    totalSkills,
    totalCertifications,
    totalTrainings,
    averageSkillLevel: Math.round(averageSkillLevel * 100) / 100,
    skillsByCategory: skillsByCategory.map(item => ({
      category: item.category,
      count: item._count.category,
    })),
  };

  res.json({
    success: true,
    data: stats,
  });
});

/**
 * @swagger
 * /api/admin/skill-matrix:
 *   get:
 *     summary: Get skill matrix data (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Skill matrix data retrieved successfully
 */
export const getSkillMatrix = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      department: true,
      role: true,
      userSkills: {
        include: {
          skill: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  const skills = await prisma.skill.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  const matrix = users.map(user => ({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
    },
    skills: skills.map(skill => {
      const userSkill = user.userSkills.find(us => us.skillId === skill.id);
      return {
        skillId: skill.id,
        skillName: skill.name,
        category: skill.category,
        proficiencyLevel: userSkill?.proficiencyLevel || 0,
        notes: userSkill?.notes || null,
        lastUpdated: userSkill?.lastUpdated || null,
      };
    }),
  }));

  res.json({
    success: true,
    data: {
      matrix,
      skills,
    },
  });
});

/**
 * @swagger
 * /api/admin/export/{type}:
 *   get:
 *     summary: Export data (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [users, skills, certifications, trainings, all]
 *     responses:
 *       200:
 *         description: Data exported successfully
 */
export const exportData = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { type } = req.params;
  const { format = 'json' } = req.query;

  let data: any = {};

  switch (type) {
    case 'users':
      data = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          department: true,
          location: true,
          projectAssignment: true,
          status: true,
          manager: true,
          phone: true,
          joinDate: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      break;

    case 'skills':
      data = await prisma.skill.findMany();
      break;

    case 'certifications':
      data = await prisma.certification.findMany({
        include: {
          employee: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
      break;

    case 'trainings':
      data = await prisma.training.findMany({
        include: {
          assignee: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
      break;

    case 'all':
      const [users, skills, certifications, trainings, userSkills] = await Promise.all([
        prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
            location: true,
            projectAssignment: true,
            status: true,
            manager: true,
            phone: true,
            joinDate: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.skill.findMany(),
        prisma.certification.findMany(),
        prisma.training.findMany(),
        prisma.userSkill.findMany({
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            skill: {
              select: {
                name: true,
                category: true,
              },
            },
          },
        }),
      ]);

      data = {
        users,
        skills,
        certifications,
        trainings,
        userSkills,
        exportedAt: new Date().toISOString(),
      };
      break;

    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid export type',
      });
  }

  logger.info(`Data exported: ${type} by ${req.user!.email}`);

  if (format === 'csv') {
    // For CSV format, we'll return JSON for now
    // In a real implementation, you'd convert to CSV
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-export.json"`);
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-export.json"`);
  }

  res.json({
    success: true,
    data,
  });
});