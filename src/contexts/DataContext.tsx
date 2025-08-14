import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  tags?: string[];
  createdBy?: string;
  createdAt?: string;
}

export interface EmployeeSkill {
  employeeId: string;
  skillId: string;
  level: number; // 1-5
  lastUpdated: string;
  assessedBy?: string;
  notes?: string;
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
  projectAssignment?: string;
  status: 'active' | 'inactive' | 'on_leave';
  manager?: string;
  phone?: string;
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
  category?: string;
  tags?: string[];
  projectAssignment?: string;
  priority: 'high' | 'medium' | 'low';
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
  tags?: string[];
  projectAssignment?: string;
  priority: 'high' | 'medium' | 'low';
  provider?: string;
  cost?: number;
}

interface DataContextType {
  skills: Skill[];
  employees: Employee[];
  employeeSkills: EmployeeSkill[];
  certifications: Certification[];
  trainings: Training[];
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  updateEmployeeSkill: (employeeId: string, skillId: string, level: number, notes?: string) => void;
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
  bulkCreateUsersWithData: (userData: any[]) => void;
  exportData: (type: 'employees' | 'skills' | 'certifications' | 'trainings' | 'all', format?: 'json' | 'csv' | 'xlsx') => void;
  getAvailableTags: () => string[];
  getAvailableCategories: () => string[];
  getAvailableProjects: () => string[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const INITIAL_SKILLS: Skill[] = [
  { id: '1', name: 'React', category: 'Frontend', description: 'React.js development and ecosystem', tags: ['JavaScript', 'UI', 'SPA'] },
  { id: '2', name: 'Node.js', category: 'Backend', description: 'Server-side JavaScript development', tags: ['JavaScript', 'API', 'Server'] },
  { id: '3', name: 'TypeScript', category: 'Programming', description: 'Typed JavaScript for better development', tags: ['JavaScript', 'Types', 'Development'] },
  { id: '4', name: 'PostgreSQL', category: 'Database', description: 'Advanced relational database management', tags: ['SQL', 'Database', 'RDBMS'] },
  { id: '5', name: 'AWS', category: 'Cloud', description: 'Amazon Web Services cloud platform', tags: ['Cloud', 'Infrastructure', 'DevOps'] },
  { id: '6', name: 'Docker', category: 'DevOps', description: 'Containerization and deployment', tags: ['Containers', 'Deployment', 'DevOps'] },
  { id: '7', name: 'Python', category: 'Programming', description: 'Python programming and frameworks', tags: ['Programming', 'AI/ML', 'Backend'] },
  { id: '8', name: 'Java', category: 'Programming', description: 'Enterprise Java development', tags: ['Programming', 'Enterprise', 'Backend'] },
  { id: '9', name: 'Kubernetes', category: 'DevOps', description: 'Container orchestration platform', tags: ['Containers', 'Orchestration', 'Cloud'] },
  { id: '10', name: 'Machine Learning', category: 'AI/ML', description: 'ML algorithms and model development', tags: ['AI', 'ML', 'Data Science'] },
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
    joinDate: '2022-03-10',
    projectAssignment: 'Project Alpha',
    status: 'active',
    manager: 'admin-1',
    phone: '+1-555-0101'
  },
  {
    id: 'emp-2',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'Full Stack Developer',
    department: 'Engineering',
    location: 'Boston',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    joinDate: '2021-08-20',
    projectAssignment: 'Project Beta',
    status: 'active',
    manager: 'admin-1',
    phone: '+1-555-0102'
  },
  {
    id: 'emp-3',
    name: 'Mike Chen',
    email: 'mike@company.com',
    role: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Seattle',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    joinDate: '2023-01-05',
    projectAssignment: 'Project Gamma',
    status: 'active',
    manager: 'admin-1',
    phone: '+1-555-0103'
  },
  {
    id: 'emp-4',
    name: 'Lisa Wang',
    email: 'lisa@company.com',
    role: 'Data Scientist',
    department: 'Analytics',
    location: 'Austin',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    joinDate: '2022-07-01',
    projectAssignment: 'Project Delta',
    status: 'active',
    manager: 'admin-1',
    phone: '+1-555-0104'
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
          { employeeId: 'emp-1', skillId: '1', level: 5, lastUpdated: '2024-01-15', assessedBy: 'self', notes: 'Expert in React hooks and context' },
          { employeeId: 'emp-1', skillId: '3', level: 4, lastUpdated: '2024-01-15', assessedBy: 'manager', notes: 'Strong TypeScript skills' },
          { employeeId: 'emp-1', skillId: '2', level: 3, lastUpdated: '2024-01-10', assessedBy: 'self', notes: 'Good Node.js knowledge' },
          { employeeId: 'emp-2', skillId: '1', level: 4, lastUpdated: '2024-01-12', assessedBy: 'self', notes: 'Solid React experience' },
          { employeeId: 'emp-2', skillId: '2', level: 5, lastUpdated: '2024-01-12', assessedBy: 'manager', notes: 'Expert in Node.js and Express' },
          { employeeId: 'emp-2', skillId: '4', level: 3, lastUpdated: '2024-01-08', assessedBy: 'self', notes: 'PostgreSQL database design' },
          { employeeId: 'emp-3', skillId: '6', level: 5, lastUpdated: '2024-01-18', assessedBy: 'manager', notes: 'Docker containerization expert' },
          { employeeId: 'emp-3', skillId: '9', level: 4, lastUpdated: '2024-01-18', assessedBy: 'self', notes: 'Kubernetes orchestration' },
          { employeeId: 'emp-3', skillId: '5', level: 4, lastUpdated: '2024-01-14', assessedBy: 'self', notes: 'AWS cloud services' }
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
            credentialId: 'AWS-DEV-2023-001',
            category: 'Cloud',
            tags: ['AWS', 'Cloud', 'Development'],
            projectAssignment: 'Project Alpha',
            priority: 'high' as const
          },
          {
            id: '2',
            name: 'Certified Kubernetes Administrator',
            employeeId: 'emp-3',
            issuedDate: '2023-09-20',
            expiryDate: '2025-09-20',
            status: 'expiring_soon' as const,
            issuer: 'Cloud Native Computing Foundation',
            credentialId: 'CKA-2023-002',
            category: 'DevOps',
            tags: ['Kubernetes', 'DevOps', 'Containers'],
            projectAssignment: 'Project Gamma',
            priority: 'high' as const
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
            duration: '40 hours',
            tags: ['React', 'Advanced', 'Patterns'],
            projectAssignment: 'Project Alpha',
            priority: 'high' as const,
            provider: 'Tech Academy',
            cost: 299
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
            duration: '30 hours',
            tags: ['Kubernetes', 'DevOps', 'Containers'],
            projectAssignment: 'Project Beta',
            priority: 'medium' as const,
            provider: 'Cloud Institute',
            cost: 199
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

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    setSkills(prev => prev.map(skill => skill.id === id ? { ...skill, ...updates } : skill));
  };

  const deleteSkill = (id: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== id));
    setEmployeeSkills(prev => prev.filter(es => es.skillId !== id));
  };

  const updateEmployeeSkill = (employeeId: string, skillId: string, level: number, notes?: string) => {
    setEmployeeSkills(prev => {
      const existing = prev.find(es => es.employeeId === employeeId && es.skillId === skillId);
      if (existing) {
        return prev.map(es => 
          es.employeeId === employeeId && es.skillId === skillId
            ? { ...es, level, lastUpdated: new Date().toISOString().split('T')[0], notes }
            : es
        );
      } else {
        return [...prev, {
          employeeId,
          skillId,
          level,
          lastUpdated: new Date().toISOString().split('T')[0],
          assessedBy: 'self',
          notes
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
      id: `emp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: emp.status || 'active' as const
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

  const bulkCreateUsersWithData = (userData: any[]) => {
    userData.forEach(data => {
      // Create employee
      const newEmployee: Employee = {
        id: `emp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        location: data.location || 'Not specified',
        joinDate: data.joinDate || new Date().toISOString().split('T')[0],
        avatar: data.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`,
        projectAssignment: data.projectAssignment,
        status: data.status || 'active',
        manager: data.manager,
        phone: data.phone
      };
      
      setEmployees(prev => [...prev, newEmployee]);

      // Add certifications if provided
      if (data.certifications && Array.isArray(data.certifications)) {
        data.certifications.forEach((cert: any) => {
          const newCert: Certification = {
            id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: cert.name,
            employeeId: newEmployee.id,
            issuedDate: cert.issuedDate,
            expiryDate: cert.expiryDate,
            status: cert.status || 'active',
            issuer: cert.issuer,
            credentialId: cert.credentialId,
            category: cert.category,
            tags: cert.tags || [],
            projectAssignment: cert.projectAssignment,
            priority: cert.priority || 'medium'
          };
          setCertifications(prev => [...prev, newCert]);
        });
      }

      // Add trainings if provided
      if (data.trainings && Array.isArray(data.trainings)) {
        data.trainings.forEach((training: any) => {
          const newTraining: Training = {
            id: `training-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            courseName: training.courseName,
            description: training.description,
            assignedTo: newEmployee.id,
            assignedBy: user?.id || 'admin-1',
            status: training.status || 'not_started',
            progress: training.progress || 0,
            dueDate: training.dueDate,
            category: training.category,
            duration: training.duration,
            tags: training.tags || [],
            projectAssignment: training.projectAssignment,
            priority: training.priority || 'medium',
            provider: training.provider,
            cost: training.cost
          };
          setTrainings(prev => [...prev, newTraining]);
        });
      }

      // Add skills if provided
      if (data.skills && Array.isArray(data.skills)) {
        data.skills.forEach((skill: any) => {
          const newEmployeeSkill: EmployeeSkill = {
            employeeId: newEmployee.id,
            skillId: skill.skillId,
            level: skill.level || 1,
            lastUpdated: new Date().toISOString().split('T')[0],
            assessedBy: 'admin',
            notes: skill.notes
          };
          setEmployeeSkills(prev => [...prev, newEmployeeSkill]);
        });
      }
    });
  };

  const exportData = (type: 'employees' | 'skills' | 'certifications' | 'trainings' | 'all', format: 'json' | 'csv' | 'xlsx' = 'json') => {
    let data: any = {};
    let filename = '';

    switch (type) {
      case 'employees':
        data = employees;
        filename = `employees.${format}`;
        break;
      case 'skills':
        data = skills;
        filename = `skills.${format}`;
        break;
      case 'certifications':
        data = certifications;
        filename = `certifications.${format}`;
        break;
      case 'trainings':
        data = trainings;
        filename = `trainings.${format}`;
        break;
      case 'all':
        data = {
          employees,
          skills,
          employeeSkills,
          certifications,
          trainings,
          exportedAt: new Date().toISOString()
        };
        filename = `skill-matrix-complete.${format}`;
        break;
    }

    if (format === 'csv') {
      // Convert to CSV format
      const csvContent = convertToCSV(data);
      downloadFile(csvContent, filename, 'text/csv');
    } else if (format === 'xlsx') {
      // For XLSX, we'll use JSON format as a fallback
      const jsonContent = JSON.stringify(data, null, 2);
      downloadFile(jsonContent, filename.replace('.xlsx', '.json'), 'application/json');
    } else {
      // JSON format
      const jsonContent = JSON.stringify(data, null, 2);
      downloadFile(jsonContent, filename, 'application/json');
    }
  };

  const convertToCSV = (data: any): string => {
    if (Array.isArray(data)) {
      if (data.length === 0) return '';
      
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            if (Array.isArray(value)) {
              return `"${value.join('; ')}"`;
            }
            return `"${String(value || '').replace(/"/g, '""')}"`;
          }).join(',')
        )
      ];
      return csvRows.join('\n');
    } else {
      // For complex objects, convert to JSON string
      return JSON.stringify(data, null, 2);
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getAvailableTags = (): string[] => {
    const allTags = new Set<string>();
    
    skills.forEach(skill => skill.tags?.forEach(tag => allTags.add(tag)));
    certifications.forEach(cert => cert.tags?.forEach(tag => allTags.add(tag)));
    trainings.forEach(training => training.tags?.forEach(tag => allTags.add(tag)));
    
    return Array.from(allTags).sort();
  };

  const getAvailableCategories = (): string[] => {
    const categories = new Set<string>();
    
    skills.forEach(skill => categories.add(skill.category));
    certifications.forEach(cert => cert.category && categories.add(cert.category));
    trainings.forEach(training => training.category && categories.add(training.category));
    
    return Array.from(categories).sort();
  };

  const getAvailableProjects = (): string[] => {
    const projects = new Set<string>();
    
    employees.forEach(emp => emp.projectAssignment && projects.add(emp.projectAssignment));
    certifications.forEach(cert => cert.projectAssignment && projects.add(cert.projectAssignment));
    trainings.forEach(training => training.projectAssignment && projects.add(training.projectAssignment));
    
    return Array.from(projects).sort();
  };

  return (
    <DataContext.Provider value={{
      skills,
      employees,
      employeeSkills,
      certifications,
      trainings,
      addSkill,
      updateSkill,
      deleteSkill,
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
      bulkCreateUsersWithData,
      exportData,
      getAvailableTags,
      getAvailableCategories,
      getAvailableProjects
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