import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Filter, Download, Grid3X3, List } from 'lucide-react';
import clsx from 'clsx';

export function SkillMatrix() {
  const { employees, skills, employeeSkills } = useData();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const departments = Array.from(new Set(employees.map(emp => emp.department)));
  const categories = Array.from(new Set(skills.map(skill => skill.category)));

  const filteredEmployees = employees.filter(emp => 
    selectedDepartment === 'all' || emp.department === selectedDepartment
  );

  const filteredSkills = skills.filter(skill =>
    selectedCategory === 'all' || skill.category === selectedCategory
  );

  const getEmployeeSkillLevel = (employeeId: string, skillId: string) => {
    const empSkill = employeeSkills.find(es => 
      es.employeeId === employeeId && es.skillId === skillId
    );
    return empSkill?.level || 0;
  };

  const getLevelColor = (level: number) => {
    if (level === 0) return 'bg-gray-100';
    if (level === 1) return 'bg-red-200';
    if (level === 2) return 'bg-orange-200';
    if (level === 3) return 'bg-yellow-200';
    if (level === 4) return 'bg-green-200';
    if (level === 5) return 'bg-green-300';
    return 'bg-gray-100';
  };

  const getLevelText = (level: number) => {
    const levels = ['N/A', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
    return levels[level] || 'N/A';
  };

  const generateCSVContent = () => {
    const headers = ['Employee', 'Department', 'Role', ...filteredSkills.map(skill => skill.name)];
    const rows = filteredEmployees.map(employee => [
      employee.name,
      employee.department,
      employee.role,
      ...filteredSkills.map(skill => getEmployeeSkillLevel(employee.id, skill.id) || 0)
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Skill Matrix</h1>
          <p className="text-gray-600 mt-1">Visual overview of team competencies and skill gaps</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          
          <button
            onClick={() => {
              const csvContent = generateCSVContent();
              downloadCSV(csvContent, 'skill-matrix.csv');
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex items-center space-x-4 flex-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Skill Competency Matrix</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 min-w-[200px]">
                  Employee
                </th>
                {filteredSkills.map(skill => (
                  <th key={skill.id} className="px-3 py-4 text-center text-sm font-medium text-gray-900 min-w-[120px]">
                    <div className="transform -rotate-45 origin-left whitespace-nowrap">
                      {skill.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map(employee => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.role}</div>
                      </div>
                    </div>
                  </td>
                  {filteredSkills.map(skill => {
                    const level = getEmployeeSkillLevel(employee.id, skill.id);
                    return (
                      <td key={skill.id} className="px-3 py-4 text-center">
                        <div 
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${getLevelColor(level)}`}
                          title={`${skill.name}: ${getLevelText(level)}`}
                        >
                          {level || '—'}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Skill Level Legend</h4>
        <div className="flex flex-wrap gap-4">
          {[
            { level: 1, label: 'Beginner', color: 'bg-red-200' },
            { level: 2, label: 'Intermediate', color: 'bg-orange-200' },
            { level: 3, label: 'Advanced', color: 'bg-yellow-200' },
            { level: 4, label: 'Expert', color: 'bg-green-200' },
            { level: 5, label: 'Master', color: 'bg-green-300' },
          ].map(item => (
            <div key={item.level} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded ${item.color}`} />
              <span className="text-sm text-gray-600">{item.level} - {item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}