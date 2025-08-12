import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface EmployeeSkill {
  employeeId: string;
  skillId: string;
  level: number; // 1-5
  lastUpdated: string;
  assessedBy?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  avatar?: string;
  joinDate: string;
}

export interface Certification {
  id: string;
  name: string;
  employeeId: string;
  issuedDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'expiring_soon';
}

export interface Training {
  id: string;
  courseName: string;
  description: string;
  assignedTo: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  dueDate?: string;
}

interface DataContextType {
  skills: Skill[];
  employees: Employee[];
  employeeSkills: EmployeeSkill[];
  certifications: Certification[];
  trainings: Training[];
  updateEmployeeSkill: (employeeId: string, skillId: string, level: number) => void;
  addCertification: (cert: Omit<Certification, 'id'>) => void;
  updateTrainingProgress: (trainingId: string, progress: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [skills] = useState<Skill[]>([
    { id: '1', name: 'React', category: 'Frontend', description: 'React.js development' },
    { id: '2', name: 'Node.js', category: 'Backend', description: 'Server-side JavaScript' },
    { id: '3', name: 'TypeScript', category: 'Programming', description: 'Typed JavaScript' },
    { id: '4', name: 'PostgreSQL', category: 'Database', description: 'Relational database' },
    { id: '5', name: 'AWS', category: 'Cloud', description: 'Amazon Web Services' },
    { id: '6', name: 'Docker', category: 'DevOps', description: 'Containerization' },
    { id: '7', name: 'Python', category: 'Programming', description: 'Python programming' },
    { id: '8', name: 'Java', category: 'Programming', description: 'Java programming' },
    { id: '9', name: 'Kubernetes', category: 'DevOps', description: 'Container orchestration' },
    { id: '10', name: 'Machine Learning', category: 'AI/ML', description: 'ML algorithms and models' }
  ]);

  const [employees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@company.com',
      role: 'Senior Developer',
      department: 'Engineering',
      location: 'New York',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      joinDate: '2022-01-15'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      role: 'Full Stack Developer',
      department: 'Engineering',
      location: 'San Francisco',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      joinDate: '2021-08-20'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@company.com',
      role: 'DevOps Engineer',
      department: 'Infrastructure',
      location: 'Seattle',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      joinDate: '2023-03-10'
    },
    {
      id: '4',
      name: 'Lisa Wang',
      email: 'lisa@company.com',
      role: 'Data Scientist',
      department: 'Analytics',
      location: 'Boston',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      joinDate: '2022-07-01'
    }
  ]);

  const [employeeSkills, setEmployeeSkills] = useState<EmployeeSkill[]>([
    { employeeId: '1', skillId: '1', level: 5, lastUpdated: '2024-01-15', assessedBy: 'self' },
    { employeeId: '1', skillId: '3', level: 4, lastUpdated: '2024-01-15', assessedBy: 'manager' },
    { employeeId: '1', skillId: '2', level: 3, lastUpdated: '2024-01-10', assessedBy: 'self' },
    { employeeId: '2', skillId: '1', level: 4, lastUpdated: '2024-01-12', assessedBy: 'self' },
    { employeeId: '2', skillId: '2', level: 5, lastUpdated: '2024-01-12', assessedBy: 'manager' },
    { employeeId: '2', skillId: '4', level: 3, lastUpdated: '2024-01-08', assessedBy: 'self' },
    { employeeId: '3', skillId: '6', level: 5, lastUpdated: '2024-01-18', assessedBy: 'manager' },
    { employeeId: '3', skillId: '9', level: 4, lastUpdated: '2024-01-18', assessedBy: 'self' },
    { employeeId: '3', skillId: '5', level: 4, lastUpdated: '2024-01-14', assessedBy: 'self' },
    { employeeId: '4', skillId: '7', level: 5, lastUpdated: '2024-01-20', assessedBy: 'manager' },
    { employeeId: '4', skillId: '10', level: 4, lastUpdated: '2024-01-20', assessedBy: 'self' },
    { employeeId: '4', skillId: '4', level: 3, lastUpdated: '2024-01-16', assessedBy: 'self' }
  ]);

  const [certifications] = useState<Certification[]>([
    {
      id: '1',
      name: 'AWS Certified Developer',
      employeeId: '1',
      issuedDate: '2023-06-15',
      expiryDate: '2026-06-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Certified Kubernetes Administrator',
      employeeId: '3',
      issuedDate: '2023-09-20',
      expiryDate: '2025-09-20',
      status: 'expiring_soon'
    },
    {
      id: '3',
      name: 'Google Cloud Professional',
      employeeId: '2',
      issuedDate: '2022-12-10',
      expiryDate: '2024-12-10',
      status: 'expired'
    }
  ]);

  const [trainings, setTrainings] = useState<Training[]>([
    {
      id: '1',
      courseName: 'Advanced React Patterns',
      description: 'Learn advanced React patterns and hooks',
      assignedTo: '1',
      status: 'in_progress',
      progress: 65,
      dueDate: '2024-03-15'
    },
    {
      id: '2',
      courseName: 'Kubernetes Fundamentals',
      description: 'Introduction to Kubernetes concepts',
      assignedTo: '2',
      status: 'not_started',
      progress: 0,
      dueDate: '2024-04-20'
    },
    {
      id: '3',
      courseName: 'Machine Learning with Python',
      description: 'Comprehensive ML course using Python',
      assignedTo: '4',
      status: 'completed',
      progress: 100
    }
  ]);

  const updateEmployeeSkill = (employeeId: string, skillId: string, level: number) => {
    setEmployeeSkills(prev => {
      const existing = prev.find(es => es.employeeId === employeeId && es.skillId === skillId);
      if (existing) {
        return prev.map(es => 
          es.employeeId === employeeId && es.skillId === skillId
            ? { ...es, level, lastUpdated: new Date().toISOString().split('T')[0] }
            : es
        );
      } else {
        return [...prev, {
          employeeId,
          skillId,
          level,
          lastUpdated: new Date().toISOString().split('T')[0],
          assessedBy: 'self'
        }];
      }
    });
  };

  const addCertification = (cert: Omit<Certification, 'id'>) => {
    // In real implementation, this would call an API
    console.log('Adding certification:', cert);
  };

  const updateTrainingProgress = (trainingId: string, progress: number) => {
    setTrainings(prev => 
      prev.map(training => 
        training.id === trainingId 
          ? { 
              ...training, 
              progress, 
              status: progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started'
            }
          : training
      )
    );
  };

  return (
    <DataContext.Provider value={{
      skills,
      employees,
      employeeSkills,
      certifications,
      trainings,
      updateEmployeeSkill,
      addCertification,
      updateTrainingProgress
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}