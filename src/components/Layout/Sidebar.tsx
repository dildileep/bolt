import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Users, 
  Target, 
  Award, 
  BookOpen, 
  BarChart3, 
  Settings,
  Grid3X3
} from 'lucide-react';
import clsx from 'clsx';

const employeeNavItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/skills', icon: Target, label: 'My Skills' },
  { to: '/certifications', icon: Award, label: 'Certifications' },
  { to: '/training', icon: BookOpen, label: 'Training' },
];

const adminNavItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/skill-matrix', icon: Grid3X3, label: 'Skill Matrix' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { user } = useAuth();
  const navItems = user?.role === 'admin' ? adminNavItems : employeeNavItems;

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <span className="font-semibold">Skills Portal</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          {user?.department} • {user?.role}
        </div>
      </div>
    </aside>
  );
}