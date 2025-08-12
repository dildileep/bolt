import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { DashboardStats } from '../components/Dashboard/DashboardStats';
import { SkillCard } from '../components/Skills/SkillCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, AlertTriangle, BookOpen } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const { skills, employeeSkills, certifications, trainings, employees, updateEmployeeSkill } = useData();

  const isAdmin = user?.role === 'admin';

  // Get user's skills for employee view
  const userSkills = employeeSkills.filter(es => es.employeeId === user?.id);
  const userSkillsWithDetails = userSkills.map(us => ({
    ...skills.find(s => s.id === us.skillId)!,
    level: us.level,
    lastUpdated: us.lastUpdated,
    assessedBy: us.assessedBy
  }));

  // Skill distribution data for charts
  const skillCategoryData = skills.reduce((acc: any[], skill) => {
    const existing = acc.find(item => item.name === skill.category);
    if (existing) {
      existing.value += employeeSkills.filter(es => es.skillId === skill.id).length;
    } else {
      acc.push({
        name: skill.category,
        value: employeeSkills.filter(es => es.skillId === skill.id).length
      });
    }
    return acc;
  }, []);

  const skillLevelData = [1, 2, 3, 4, 5].map(level => ({
    level: `Level ${level}`,
    count: employeeSkills.filter(es => es.level === level).length
  }));

  const COLORS = ['#3B82F6', '#14B8A6', '#F97316', '#8B5CF6', '#EF4444', '#10B981'];

  // Expiring certifications
  const expiringCerts = certifications.filter(c => c.status === 'expiring_soon');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin 
              ? 'Overview of organizational skills and development' 
              : 'Track your skills, certifications, and learning progress'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      <DashboardStats />

      {isAdmin ? (
        // Admin Dashboard Content
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skill Categories Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={skillCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {skillCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Levels Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Level Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillLevelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {employeeSkills.slice(0, 5).map((skill, index) => {
                const employee = employees.find(e => e.id === skill.employeeId);
                const skillDetails = skills.find(s => s.id === skill.skillId);
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <img
                      src={employee?.avatar}
                      alt={employee?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{employee?.name}</span> updated{' '}
                        <span className="font-medium">{skillDetails?.name}</span> to level {skill.level}
                      </p>
                      <p className="text-xs text-gray-500">{skill.lastUpdated}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
              Alerts & Notifications
            </h3>
            <div className="space-y-3">
              {expiringCerts.map((cert) => {
                const employee = employees.find(e => e.id === cert.employeeId);
                return (
                  <div key={cert.id} className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <span className="font-medium">{employee?.name}</span>'s {cert.name} expires on{' '}
                      {new Date(cert.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  3 employees have pending skill assessments
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Employee Dashboard Content
        <div className="space-y-8">
          {/* My Skills Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">My Skills Overview</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <TrendingUp className="w-4 h-4" />
                <span>Average Level: {userSkills.length ? (userSkills.reduce((acc, skill) => acc + skill.level, 0) / userSkills.length).toFixed(1) : '0'}/5</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userSkillsWithDetails.slice(0, 6).map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  level={skill.level}
                  lastUpdated={skill.lastUpdated}
                  assessedBy={skill.assessedBy}
                  onUpdate={updateEmployeeSkill}
                />
              ))}
            </div>
            
            {userSkillsWithDetails.length > 6 && (
              <div className="text-center mt-6">
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  View All Skills ({userSkillsWithDetails.length})
                </button>
              </div>
            )}
          </div>

          {/* Learning Path & Certifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Training */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
                Current Training
              </h3>
              <div className="space-y-4">
                {trainings
                  .filter(t => t.assignedTo === user?.id && t.status !== 'completed')
                  .map((training) => (
                    <div key={training.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900">{training.courseName}</h4>
                      <p className="text-sm text-gray-600 mt-1">{training.description}</p>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{training.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${training.progress}%` }}
                          />
                        </div>
                      </div>
                      {training.dueDate && (
                        <p className="text-xs text-gray-500 mt-2">
                          Due: {new Date(training.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">My Certifications</h3>
              <div className="space-y-3">
                {certifications
                  .filter(c => c.employeeId === user?.id)
                  .map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{cert.name}</h4>
                        <p className="text-sm text-gray-500">
                          Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        cert.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : cert.status === 'expiring_soon'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {cert.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}