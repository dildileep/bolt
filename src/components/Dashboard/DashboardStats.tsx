import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Target, Award, BookOpen, TrendingUp, Users, AlertTriangle } from 'lucide-react';

export function DashboardStats() {
  const { user } = useAuth();
  const { employeeSkills, certifications, trainings, employees } = useData();

  const isAdmin = user?.role === 'admin';

  // Calculate stats
  const totalSkills = isAdmin 
    ? employeeSkills.length 
    : employeeSkills.filter(es => es.employeeId === user?.id).length;

  const activeCerts = isAdmin
    ? certifications.filter(c => c.status === 'active').length
    : certifications.filter(c => c.employeeId === user?.id && c.status === 'active').length;

  const inProgressTrainings = isAdmin
    ? trainings.filter(t => t.status === 'in_progress').length
    : trainings.filter(t => t.assignedTo === user?.id && t.status === 'in_progress').length;

  const expiringCerts = isAdmin
    ? certifications.filter(c => c.status === 'expiring_soon').length
    : certifications.filter(c => c.employeeId === user?.id && c.status === 'expiring_soon').length;

  const stats = isAdmin ? [
    {
      title: 'Total Employees',
      value: employees.length,
      icon: Users,
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      title: 'Skill Assessments',
      value: totalSkills,
      icon: Target,
      color: 'bg-green-500',
      change: '+15 this week'
    },
    {
      title: 'Active Certifications',
      value: activeCerts,
      icon: Award,
      color: 'bg-purple-500',
      change: '3 expiring soon'
    },
    {
      title: 'Training Progress',
      value: `${Math.round((trainings.filter(t => t.status === 'completed').length / trainings.length) * 100)}%`,
      icon: BookOpen,
      color: 'bg-teal-500',
      change: '+5% this month'
    }
  ] : [
    {
      title: 'My Skills',
      value: totalSkills,
      icon: Target,
      color: 'bg-blue-500',
      change: 'Last updated today'
    },
    {
      title: 'Certifications',
      value: activeCerts,
      icon: Award,
      color: 'bg-green-500',
      change: expiringCerts > 0 ? `${expiringCerts} expiring soon` : 'All up to date'
    },
    {
      title: 'Training',
      value: inProgressTrainings,
      icon: BookOpen,
      color: 'bg-purple-500',
      change: 'In progress'
    },
    {
      title: 'Skill Level',
      value: '4.2/5',
      icon: TrendingUp,
      color: 'bg-teal-500',
      change: '+0.3 this month'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}