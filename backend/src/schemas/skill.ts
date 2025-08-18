import { z } from 'zod';

export const createSkillSchema = z.object({
  name: z.string().min(2, 'Skill name must be at least 2 characters'),
  category: z.enum([
    'FRONTEND',
    'BACKEND',
    'DATABASE',
    'DEVOPS',
    'CLOUD',
    'PROGRAMMING',
    'AI_ML',
    'MOBILE',
    'TESTING',
    'SECURITY',
    'DESIGN',
    'MANAGEMENT',
    'OTHER'
  ]),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  tags: z.array(z.string()).default([]),
});

export const updateSkillSchema = createSkillSchema.partial();

export const bulkCreateSkillsSchema = z.array(createSkillSchema);

export const updateUserSkillSchema = z.object({
  proficiencyLevel: z.number().min(1).max(5),
  notes: z.string().optional(),
});

export const skillQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  category: z.enum([
    'FRONTEND',
    'BACKEND',
    'DATABASE',
    'DEVOPS',
    'CLOUD',
    'PROGRAMMING',
    'AI_ML',
    'MOBILE',
    'TESTING',
    'SECURITY',
    'DESIGN',
    'MANAGEMENT',
    'OTHER'
  ]).optional(),
  sortBy: z.enum(['name', 'category', 'createdAt', 'updatedAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});