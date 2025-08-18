import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createSkillSchema, updateSkillSchema, bulkCreateSkillsSchema, skillQuerySchema, updateUserSkillSchema } from '../schemas/skill';
import {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  bulkCreateSkills,
  getUserSkills,
  updateUserSkill,
  deleteUserSkill,
} from '../controllers/skillController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all skills
router.get('/', validateRequest({ query: skillQuerySchema }), getSkills);

// Create new skill
router.post('/', validateRequest({ body: createSkillSchema }), createSkill);

// Bulk create skills (admin only)
router.post('/bulk', requireAdmin, validateRequest({ body: bulkCreateSkillsSchema }), bulkCreateSkills);

// Get user skills
router.get('/user/:userId', getUserSkills);

// Update user skill
router.put('/user/:userId/:skillId', validateRequest({ body: updateUserSkillSchema }), updateUserSkill);

// Delete user skill
router.delete('/user/:userId/:skillId', deleteUserSkill);

// Get skill by ID
router.get('/:id', getSkillById);

// Update skill (admin only)
router.put('/:id', requireAdmin, validateRequest({ body: updateSkillSchema }), updateSkill);

// Delete skill (admin only)
router.delete('/:id', requireAdmin, deleteSkill);

export default router;