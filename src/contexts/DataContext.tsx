import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  createdBy?: string;
  createdAt?: string;
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
  issuer?: string;
  credentialId?: string;
  verificationUrl?: string;
}

export interface Training {
  id: string;
  courseName: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  dueDate?: string;
  startDate?: string;
  completedDate?: string;
  category?: string;
  duration?: string;
}

interface DataContextType {
  skills: Skill[];
  employees: Employee[];
  employeeSkills: EmployeeSkill[];
  certifications: Certification[];
  trainings: Training[];
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateEmployeeSkill: (employeeId: string, skillId: string, level: number) => void;
  addCertification: (cert: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, updates: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;
  addTraining: (training: Omit<Training, 'id'>) => void;
  updateTrainingProgress: (trainingId: string, progress: number) => void;
  updateTraining: (id: string, updates: Partial<Training>) => void;
  deleteTraining: (id: string) => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  bulkAddEmployees: (employees: Omit<Employee, 'id'>[]) => void;
  bulkAddSkills: (skills: Omit<Skill, 'id'>[]) => void;
  exportData: (type: 'employees' | 'skills' | 'certifications' | 'trainings') => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const INITIAL_SKILLS: Skill[] = [
  { id: '1', name: 'React', category: 'Frontend', description: 'React.js development and ecosystem' },
  { id: '2', name: 'Node.js', category: 'Backend', description: 'Server-side JavaScript development' },
  { id: '3', name: 'TypeScript', category: 'Programming', description: 'Typed JavaScript for better development' },
  { id: '4', name: 'PostgreSQL', category: 'Database', description: 'Advanced relational database management' },
  { id: '5', name: 'AWS', category: 'Cloud', description: 'Amazon Web Services cloud platform' },
  { id: '6', name: 'Docker', category: 'DevOps', description: 'Containerization and deployment' },
  { id: '7', name: 'Python', category: 'Programming', description: 'Python programming and frameworks' },
  { id: '8', name: 'Java', category: 'Programming', description: 'Enterprise Java development' },
  { id: '9', name: 'Kubernetes', category: 'DevOps', description: 'Container orchestration platform' },
  { id: '10', name: 'Machine Learning', category: 'AI/ML', description: 'ML algorithms and model development' },
  { id: '11', name: 'Vue.js', category: 'Frontend', description: 'Progressive JavaScript framework' },
  { id: '12', name: 'MongoDB', category: 'Database', description: 'NoSQL document database' },
  { id: '13', name: 'GraphQL', category: 'API', description: 'Query language for APIs' },
  { id: '14', name: 'Redis', category: 'Database', description: 'In-memory data structure store' },
  { id: '15', name: 'Terraform', category: 'DevOps', description: 'Infrastructure as Code tool' }
];

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'John Doe',
    email: 'john@company.com',
    role: 'Senior Developer',
    department: 'Engineering',
    location: 'San Francisco',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    joinDate: '2022-03-10'
  },
  {
    id: 'emp-2',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'Full Stack Developer',
    department: 'Engineering',
    location: 'Boston',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    joinDate: '2021-08-20'
  },
  {
    id: 'emp-3',
    name: 'Mike Chen',
    email: 'mike@company.com',
    role: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Seattle',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    joinDate: '2023-01-05'
  },
  {
    id: 'emp-4',
    name: 'Lisa Wang',
    email: 'lisa@company.com',
    role: 'Data Scientist',
    department: 'Analytics',
    location: 'Austin',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    joinDate: '2022-07-01'
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeSkills, setEmployeeSkills] = useState<EmployeeSkill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);

  // Initialize data
  useEffect(() => {
    const initializeData = () => {
      // Load or initialize skills
      const savedSkills = localStorage.getItem('skillMatrix_skills');
      if (savedSkills) {
        setSkills(JSON.parse(savedSkills));
      } else {
        setSkills(INITIAL_SKILLS);
        localStorage.setItem('skillMatrix_skills', JSON.stringify(INITIAL_SKILLS));
      }

      // Load or initialize employees
      const savedEmployees = localStorage.getItem('skillMatrix_employees');
      if (savedEmployees) {
        setEmployees(JSON.parse(savedEmployees));
      } else {
        setEmployees(INITIAL_EMPLOYEES);
        localStorage.setItem('skillMatrix_employees', JSON.stringify(INITIAL_EMPLOYEES));
      }

      // Load other data
      const savedEmployeeSkills = localStorage.getItem('skillMatrix_employeeSkills');
      if (savedEmployeeSkills) {
        setEmployeeSkills(JSON.parse(savedEmployeeSkills));
      } else {
        const initialEmployeeSkills = [
          { employeeId: 'emp-1', skillId: '1', level: 5, lastUpdated: '2024-01-15', assessedBy: 'self' },
          { employeeId: 'emp-1', skillId: '3', level: 4, lastUpdated: '2024-01-15', assessedBy: 'manager' },
          { employeeId: 'emp-1', skillId: '2', level: 3, lastUpdated: '2024-01-10', assessedBy: 'self' },
          { employeeId: 'emp-2', skillId: '1', level: 4, lastUpdated: '2024-01-12', assessedBy: 'self' },
          { employeeId: 'emp-2', skillId: '2', level: 5, lastUpdated: '2024-01-12', assessedBy: 'manager' },
          { employeeId: 'emp-2', skillId: '4', level: 3, lastUpdated: '2024-01-08', assessedBy: 'self' },
          { employeeId: 'emp-3', skillId: '6', level: 5, lastUpdated: '2024-01-18', assessedBy: 'manager' },
          { employeeId: 'emp-3', skillId: '9', level: 4, lastUpdated: '2024-01-18', assessedBy: 'self' },
          { employeeId: 'emp-3', skillId: '5', level: 4, lastUpdated: '2024-01-14', assessedBy: 'self' }
        ];
        setEmployeeSkills(initialEmployeeSkills);
        localStorage.setItem('skillMatrix_employeeSkills', JSON.stringify(initialEmployeeSkills));
      }

      const savedCertifications = localStorage.getItem('skillMatrix_certifications');
      if (savedCertifications) {
        setCertifications(JSON.parse(savedCertifications));
      } else {
        const initialCertifications = [
          {
            id: '1',
            name: 'AWS Certified Developer',
            employeeId: 'emp-1',
            issuedDate: '2023-06-15',
            expiryDate: '2026-06-15',
            status: 'active' as const,
            issuer: 'Amazon Web Services',
            credentialId: 'AWS-DEV-2023-001'
          },
          {
            id: '2',
            name: 'Certified Kubernetes Administrator',
            employeeId: 'emp-3',
            issuedDate: '2023-09-20',
            expiryDate: '2025-09-20',
            status: 'expiring_soon' as const,
            issuer: 'Cloud Native Computing Foundation',
            credentialId: 'CKA-2023-002'
          }
        ];
        setCertifications(initialCertifications);
        localStorage.setItem('skillMatrix_certifications', JSON.stringify(initialCertifications));
      }

      const savedTrainings = localStorage.getItem('skillMatrix_trainings');
      if (savedTrainings) {
        setTrainings(JSON.parse(savedTrainings));
      } else {
        const initialTrainings = [
          {
            id: '1',
            courseName: 'Advanced React Patterns',
            description: 'Learn advanced React patterns and hooks',
            assignedTo: 'emp-1',
            assignedBy: 'admin-1',
            status: 'in_progress' as const,
            progress: 65,
            dueDate: '2024-03-15',
            category: 'Frontend',
            duration: '40 hours'
          },
          {
            id: '2',
            courseName: 'Kubernetes Fundamentals',
            description: 'Introduction to Kubernetes concepts',
            assignedTo: 'emp-2',
            assignedBy: 'admin-1',
            status: 'not_started' as const,
            progress: 0,
            dueDate: '2024-04-20',
            category: 'DevOps',
            duration: '30 hours'
          }
        ];
        setTrainings(initialTrainings);
        localStorage.setItem('skillMatrix_trainings', JSON.stringify(initialTrainings));
      }
    };

    initializeData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (skills.length > 0) {
      localStorage.setItem('skillMatrix_skills', JSON.stringify(skills));
    }
  }, [skills]);

  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem('skillMatrix_employees', JSON.stringify(employees));
    }
  }, [employees]);

  useEffect(() => {
    if (employeeSkills.length > 0) {
      localStorage.setItem('skillMatrix_employeeSkills', JSON.stringify(employeeSkills));
    }
  }, [employeeSkills]);

  useEffect(() => {
    if (certifications.length > 0) {
      localStorage.setItem('skillMatrix_certifications', JSON.stringify(certifications));
    }
  }, [certifications]);

  useEffect(() => {
    if (trainings.length > 0) {
      localStorage.setItem('skillMatrix_trainings', JSON.stringify(trainings));
    }
  }, [trainings]);

  const addSkill = (skill: Omit<Skill, 'id'>) => {
    const newSkill: Skill = {
      ...skill,
      id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdBy: user?.id,
      createdAt: new Date().toISOString()
    };
    setSkills(prev => [...prev, newSkill]);
  };

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
    const newCert: Certification = {
      ...cert,
      id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setCertifications(prev => [...prev, newCert]);
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    setCertifications(prev => 
      prev.map(cert => cert.id === id ? { ...cert, ...updates } : cert)
    );
  };

  const deleteCertification = (id: string) => {
    setCertifications(prev => prev.filter(cert => cert.id !== id));
  };

  const addTraining = (training: Omit<Training, 'id'>) => {
    const newTraining: Training = {
      ...training,
      id: `training-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setTrainings(prev => [...prev, newTraining]);
  };

  const updateTrainingProgress = (trainingId: string, progress: number) => {
    setTrainings(prev => 
      prev.map(training => 
        training.id === trainingId 
          ? { 
              ...training, 
              progress, 
              status: progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started',
              completedDate: progress === 100 ? new Date().toISOString().split('T')[0] : training.completedDate
            }
          : training
      )
    );
  };

  const updateTraining = (id: string, updates: Partial<Training>) => {
    setTrainings(prev => 
      prev.map(training => training.id === id ? { ...training, ...updates } : training)
    );
  };

  const deleteTraining = (id: string) => {
    setTrainings(prev => prev.filter(training => training.id !== id));
  };

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: `emp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => 
      prev.map(emp => emp.id === id ? { ...emp, ...updates } : emp)
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    // Also remove related data
    setEmployeeSkills(prev => prev.filter(es => es.employeeId !== id));
    setCertifications(prev => prev.filter(cert => cert.employeeId !== id));
    setTrainings(prev => prev.filter(training => training.assignedTo !== id));
  };

  const bulkAddEmployees = (newEmployees: Omit<Employee, 'id'>[]) => {
    const employeesWithIds = newEmployees.map(emp => ({
      ...emp,
      id: `emp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
    setEmployees(prev => [...prev, ...employeesWithIds]);
  };

  const bulkAddSkills = (newSkills: Omit<Skill, 'id'>[]) => {
    const skillsWithIds = newSkills.map(skill => ({
      ...skill,
      id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdBy: user?.id,
      createdAt: new Date().toISOString()
    }));
    setSkills(prev => [...prev, ...skillsWithIds]);
  };

  const exportData = (type: 'employees' | 'skills' | 'certifications' | 'trainings') => {
    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'employees':
        data = employees;
        filename = 'employees.json';
        break;
      case 'skills':
        data = skills;
        filename = 'skills.json';
        break;
      case 'certifications':
        data = certifications;
        filename = 'certifications.json';
        break;
      case 'trainings':
        data = trainings;
        filename = 'trainings.json';
        break;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DataContext.Provider value={{
      skills,
      employees,
      employeeSkills,
      certifications,
      trainings,
      addSkill,
      updateEmployeeSkill,
      addCertification,
      updateCertification,
      deleteCertification,
      addTraining,
      updateTrainingProgress,
      updateTraining,
      deleteTraining,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      bulkAddEmployees,
      bulkAddSkills,
      exportData
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