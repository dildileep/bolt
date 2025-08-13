import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'admin';
  department: string;
  avatar?: string;
  location?: string;
  joinDate?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const MOCK_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'admin',
    department: 'IT',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    location: 'New York',
    joinDate: '2020-01-15'
  },
  {
    id: 'emp-1',
    name: 'John Doe',
    email: 'john@company.com',
    role: 'employee',
    department: 'Engineering',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    location: 'San Francisco',
    joinDate: '2022-03-10'
  },
  {
    id: 'emp-2',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'employee',
    department: 'Engineering',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    location: 'Boston',
    joinDate: '2021-08-20'
  },
  {
    id: 'emp-3',
    name: 'Mike Chen',
    email: 'mike@company.com',
    role: 'employee',
    department: 'Infrastructure',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    location: 'Seattle',
    joinDate: '2023-01-05'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const checkSession = () => {
      try {
        const savedSession = localStorage.getItem('skillMatrix_session');
        if (savedSession) {
          const session = JSON.parse(savedSession);
          const now = new Date().getTime();
          
          // Check if session is still valid (24 hours)
          if (session.expiresAt > now) {
            const userData = MOCK_USERS.find(u => u.id === session.userId);
            if (userData) {
              setUser(userData);
            } else {
              localStorage.removeItem('skillMatrix_session');
            }
          } else {
            localStorage.removeItem('skillMatrix_session');
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        localStorage.removeItem('skillMatrix_session');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validate credentials
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (password.length < 3) {
        throw new Error('Password must be at least 3 characters long');
      }
      
      // Find user by email
      const userData = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!userData) {
        throw new Error('Invalid email or password. Please check your credentials.');
      }

      // Create session
      const session = {
        userId: userData.id,
        expiresAt: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
      };
      
      localStorage.setItem('skillMatrix_session', JSON.stringify(session));
      setUser(userData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('skillMatrix_session');
    // Clear all user-specific data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('skillMatrix_')) {
        localStorage.removeItem(key);
      }
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}