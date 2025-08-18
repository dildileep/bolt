import { PrismaClient, Role, SkillCategory } from '@prisma/client';
import { hashPassword } from '../utils/auth';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

async function main() {
  logger.info('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@company.com',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      department: 'IT',
      location: 'New York',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    },
  });

  // Create regular users
  const userPassword = await hashPassword('user123');
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john@company.com' },
      update: {},
      create: {
        name: 'John Doe',
        email: 'john@company.com',
        passwordHash: userPassword,
        role: Role.USER,
        department: 'Engineering',
        location: 'San Francisco',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        projectAssignment: 'Project Alpha',
      },
    }),
    prisma.user.upsert({
      where: { email: 'sarah@company.com' },
      update: {},
      create: {
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        passwordHash: userPassword,
        role: Role.USER,
        department: 'Engineering',
        location: 'Boston',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        projectAssignment: 'Project Beta',
      },
    }),
    prisma.user.upsert({
      where: { email: 'mike@company.com' },
      update: {},
      create: {
        name: 'Mike Chen',
        email: 'mike@company.com',
        passwordHash: userPassword,
        role: Role.USER,
        department: 'Infrastructure',
        location: 'Seattle',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        projectAssignment: 'Project Gamma',
      },
    }),
  ]);

  // Create skills
  const skills = await Promise.all([
    prisma.skill.upsert({
      where: { name: 'React' },
      update: {},
      create: {
        name: 'React',
        category: SkillCategory.FRONTEND,
        description: 'React.js development and ecosystem',
        tags: ['JavaScript', 'UI', 'SPA'],
        createdBy: admin.id,
      },
    }),
    prisma.skill.upsert({
      where: { name: 'Node.js' },
      update: {},
      create: {
        name: 'Node.js',
        category: SkillCategory.BACKEND,
        description: 'Server-side JavaScript development',
        tags: ['JavaScript', 'API', 'Server'],
        createdBy: admin.id,
      },
    }),
    prisma.skill.upsert({
      where: { name: 'TypeScript' },
      update: {},
      create: {
        name: 'TypeScript',
        category: SkillCategory.PROGRAMMING,
        description: 'Typed JavaScript for better development',
        tags: ['JavaScript', 'Types', 'Development'],
        createdBy: admin.id,
      },
    }),
    prisma.skill.upsert({
      where: { name: 'PostgreSQL' },
      update: {},
      create: {
        name: 'PostgreSQL',
        category: SkillCategory.DATABASE,
        description: 'Advanced relational database management',
        tags: ['SQL', 'Database', 'RDBMS'],
        createdBy: admin.id,
      },
    }),
    prisma.skill.upsert({
      where: { name: 'AWS' },
      update: {},
      create: {
        name: 'AWS',
        category: SkillCategory.CLOUD,
        description: 'Amazon Web Services cloud platform',
        tags: ['Cloud', 'Infrastructure', 'DevOps'],
        createdBy: admin.id,
      },
    }),
    prisma.skill.upsert({
      where: { name: 'Docker' },
      update: {},
      create: {
        name: 'Docker',
        category: SkillCategory.DEVOPS,
        description: 'Containerization and deployment',
        tags: ['Containers', 'Deployment', 'DevOps'],
        createdBy: admin.id,
      },
    }),
  ]);

  // Create user skills
  const userSkills = [
    { userId: users[0].id, skillId: skills[0].id, proficiencyLevel: 5, notes: 'Expert in React hooks and context' },
    { userId: users[0].id, skillId: skills[2].id, proficiencyLevel: 4, notes: 'Strong TypeScript skills' },
    { userId: users[0].id, skillId: skills[1].id, proficiencyLevel: 3, notes: 'Good Node.js knowledge' },
    { userId: users[1].id, skillId: skills[0].id, proficiencyLevel: 4, notes: 'Solid React experience' },
    { userId: users[1].id, skillId: skills[1].id, proficiencyLevel: 5, notes: 'Expert in Node.js and Express' },
    { userId: users[1].id, skillId: skills[3].id, proficiencyLevel: 3, notes: 'PostgreSQL database design' },
    { userId: users[2].id, skillId: skills[5].id, proficiencyLevel: 5, notes: 'Docker containerization expert' },
    { userId: users[2].id, skillId: skills[4].id, proficiencyLevel: 4, notes: 'AWS cloud services' },
  ];

  for (const userSkill of userSkills) {
    await prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId: userSkill.userId,
          skillId: userSkill.skillId,
        },
      },
      update: {},
      create: {
        ...userSkill,
        assessedBy: admin.id,
      },
    });
  }

  // Create sample certifications
  await prisma.certification.upsert({
    where: { id: 'cert-1' },
    update: {},
    create: {
      id: 'cert-1',
      name: 'AWS Certified Developer',
      employeeId: users[0].id,
      issuedDate: new Date('2023-06-15'),
      expiryDate: new Date('2026-06-15'),
      status: 'ACTIVE',
      issuer: 'Amazon Web Services',
      credentialId: 'AWS-DEV-2023-001',
      category: 'Cloud',
      tags: ['AWS', 'Cloud', 'Development'],
      projectAssignment: 'Project Alpha',
      priority: 'HIGH',
    },
  });

  // Create sample training
  await prisma.training.upsert({
    where: { id: 'training-1' },
    update: {},
    create: {
      id: 'training-1',
      courseName: 'Advanced React Patterns',
      description: 'Learn advanced React patterns and hooks',
      assignedTo: users[0].id,
      assignedBy: admin.id,
      status: 'IN_PROGRESS',
      progress: 65,
      dueDate: new Date('2024-03-15'),
      category: 'Frontend',
      duration: '40 hours',
      tags: ['React', 'Advanced', 'Patterns'],
      projectAssignment: 'Project Alpha',
      priority: 'HIGH',
      provider: 'Tech Academy',
      cost: 299,
    },
  });

  logger.info('✅ Database seed completed successfully!');
  logger.info(`👤 Admin user: admin@company.com / admin123`);
  logger.info(`👥 Regular users: john@company.com, sarah@company.com, mike@company.com / user123`);
}

main()
  .catch((e) => {
    logger.error('❌ Database seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });