import { User, Skill, UserSkill, Certification, Training, Report } from '@prisma/client';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface UserWithSkills extends User {
  userSkills: (UserSkill & {
    skill: Skill;
  })[];
  certifications: Certification[];
  trainings: Training[];
}

export interface SkillWithUsers extends Skill {
  userSkills: (UserSkill & {
    user: User;
  })[];
}

export interface DashboardStats {
  totalUsers: number;
  totalSkills: number;
  totalCertifications: number;
  totalTrainings: number;
  averageSkillLevel: number;
  skillsByCategory: {
    category: string;
    count: number;
  }[];
  recentActivity: {
    type: string;
    message: string;
    timestamp: Date;
    user: string;
  }[];
}

export interface SkillGapReport {
  department: string;
  requiredSkills: string[];
  availableSkills: string[];
  gaps: {
    skill: string;
    requiredLevel: number;
    currentLevel: number;
    gap: number;
  }[];
}

export interface BulkUploadResult {
  success: boolean;
  processed: number;
  created: number;
  updated: number;
  errors: {
    row: number;
    message: string;
  }[];
}