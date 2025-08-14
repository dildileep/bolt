import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Filter, Download, Grid3X3, List, Search, Eye, Users, Target } from 'lucide-react';
import clsx from 'clsx';

export function SkillMatrix() {
  const { employees, skills, employeeSkills, exportData } = useData();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const departments = Array.from(new Set(employees.map(emp => emp.department)));
  const categories = Array.from(new Set(skills.map(skill => skill.category)));
  const projects = Array.from(new Set(employees.map(emp => emp.projectAssignment).filter(Boolean)));

  const filteredEmployees = employees.filter(emp => 
    (selectedDepartment === 'all' || emp.department === selectedDepartment) &&
    (selectedProject === 'all' || emp.projectAssignment === selectedProject) &&
    (searchTerm === '' || emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     emp.role.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const getEmployeeSkillNotes = (employeeId: string, skillId: string) => {
    const empSkill = employeeSkills.find(es => 
      es.employeeId === employeeId && es.skillId === skillId
    );
    return empSkill?.notes || '';
  };

  const getLevelColor = (level: number) => {
    if (level === 0) return 'bg-gray-100 text-gray-400';
    if (level === 1) return 'bg-red-200 text-red-800';
    if (level === 2) return 'bg-orange-200 text-orange-800';
    if (level === 3) return 'bg-yellow-200 text-yellow-800';
    if (level === 4) return 'bg-green-200 text-green-800';
    if (level === 5) return 'bg-green-300 text-green-900';
    return 'bg-gray-100 text-gray-400';
  };

  const getLevelText = (level: number) => {
    const levels = ['N/A', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
    return levels[level] || 'N/A';
  };

  const handleExport = (format: 'json' | 'csv') => {
    const matrixData = filteredEmployees.map(employee => {
      const row: any = {
        'Employee Name': employee.name,
        'Email': employee.email,
        'Department': employee.department,
        'Role': employee.role,
        'Project': employee.projectAssignment || 'Unassigned',
        'Location': employee.location,
        'Status': employee.status
      };
      
      filteredSkills.forEach(skill => {
        const level = getEmployeeSkillLevel(employee.id, skill.id);
        row[skill.name] = level > 0 ? `${level} - ${getLevelText(level)}` : 'Not Assessed';
      });
      
      return row;
    });

    if (format === 'csv') {
      exportData('all', 'csv');
    } else {
      const blob = new Blob([JSON.stringify(matrixData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'skill-matrix.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const selectedEmployeeData = selectedEmployee 
    ? employees.find(e => e.id === selectedEmployee)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Skill Matrix</h1>
          <p className="text-gray-600 mt-1">Comprehensive view of team competencies and skill gaps</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{filteredEmployees.length} employees</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Target className="w-4 h-4" />
            <span>{filteredSkills.length} skills</span>
          </div>
          
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
          
          <div className="flex space-x-2">
            <button 
              onClick={() => handleExport('json')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>JSON</span>
            </button>
            <button 
              onClick={() => handleExport('csv')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skill Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Skill Competency Matrix ({filteredEmployees.length} employees × {filteredSkills.length} skills)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50 sticky left-0 z-20 border-r border-gray-200 min-w-[250px]">
                    Employee Details
                  </th>
                  {filteredSkills.map(skill => (
                    <th key={skill.id} className="px-3 py-4 text-center text-sm font-medium text-gray-900 min-w-[100px] border-r border-gray-200">
                      <div className="flex flex-col items-center space-y-1">
                        <span className="font-semibold">{skill.name}</span>
                        <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                          {skill.category}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-4 text-center text-sm font-medium text-gray-900 min-w-[80px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map(employee => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 bg-white sticky left-0 z-10 border-r border-gray-200">
                      <div className="flex items-center space-x-3">
                        <img
                          src={employee.avatar}
                          alt={employee.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 truncate">{employee.name}</div>
                          <div className="text-sm text-gray-500 truncate">{employee.role}</div>
                          <div className="text-xs text-gray-400 truncate">{employee.department}</div>
                          {employee.projectAssignment && (
                            <div className="text-xs text-blue-600 truncate">
                              📋 {employee.projectAssignment}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    {filteredSkills.map(skill => {
                      const level = getEmployeeSkillLevel(employee.id, skill.id);
                      const notes = getEmployeeSkillNotes(employee.id, skill.id);
                      return (
                        <td key={skill.id} className="px-3 py-4 text-center border-r border-gray-200">
                          <div 
                            className={`inline-flex items-center justify-center w-12 h-12 rounded-lg text-sm font-bold cursor-pointer transition-all hover:scale-105 ${getLevelColor(level)}`}
                            title={`${skill.name}: ${getLevelText(level)}${notes ? `\nNotes: ${notes}` : ''}`}
                          >
                            {level || '—'}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => setSelectedEmployee(employee.id)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View employee details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enhanced Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Skill Level Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { level: 0, label: 'Not Assessed', color: 'bg-gray-100 text-gray-400' },
            { level: 1, label: 'Beginner', color: 'bg-red-200 text-red-800' },
            { level: 2, label: 'Intermediate', color: 'bg-orange-200 text-orange-800' },
            { level: 3, label: 'Advanced', color: 'bg-yellow-200 text-yellow-800' },
            { level: 4, label: 'Expert', color: 'bg-green-200 text-green-800' },
            { level: 5, label: 'Master', color: 'bg-green-300 text-green-900' },
          ].map(item => (
            <div key={item.level} className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${item.color}`}>
                {item.level || '—'}
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-500">Level {item.level}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && selectedEmployeeData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Employee Skills Profile</h3>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Employee Info */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={selectedEmployeeData.avatar}
                  alt={selectedEmployeeData.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{selectedEmployeeData.name}</h4>
                  <p className="text-gray-600">{selectedEmployeeData.role}</p>
                  <p className="text-sm text-gray-500">{selectedEmployeeData.department} • {selectedEmployeeData.location}</p>
                  {selectedEmployeeData.projectAssignment && (
                    <p className="text-sm text-blue-600">📋 {selectedEmployeeData.projectAssignment}</p>
                  )}
                </div>
              </div>

              {/* Skills Grid */}
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Skill Assessment</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSkills.map(skill => {
                    const level = getEmployeeSkillLevel(selectedEmployeeData.id, skill.id);
                    const notes = getEmployeeSkillNotes(selectedEmployeeData.id, skill.id);
                    return (
                      <div key={skill.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h6 className="font-medium text-gray-900">{skill.name}</h6>
                            <p className="text-xs text-gray-500">{skill.category}</p>
                          </div>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${getLevelColor(level)}`}>
                            {level || '—'}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{getLevelText(level)}</div>
                        {notes && (
                          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                            <strong>Notes:</strong> {notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}