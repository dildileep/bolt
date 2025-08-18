import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import { getDashboardStats, getSkillMatrix, exportData } from '../controllers/adminController';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Dashboard statistics
router.get('/dashboard', getDashboardStats);

// Skill matrix
router.get('/skill-matrix', getSkillMatrix);

// Export data
router.get('/export/:type', exportData);

export default router;