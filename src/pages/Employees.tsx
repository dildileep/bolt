import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Search, Filter, User, Mail, MapPin, Calendar, Target } from 'lucide-react';

export function Employees() {
  const { employees, employeeSkills, skills } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const departments = Array.from(new Set(employees.map(emp => emp.department)));

  const filteredEmployees = employees.filter(emp => 
    (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     emp.role.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedDepartment === 'all' || emp.department === selectedDepartment)
  );

  const getEmployeeSkillCount = (employeeId: string) => {
    return employeeSkills.filter(es => es.employeeId === employeeId).length;
  };

  const getEmployeeAverageSkillLevel = (employeeId: string) => {
    const empSkills = employeeSkills.filter(es => es.employeeId === employeeId);
    if (empSkills.length === 0) return 0;
    const total = empSkills.reduce((acc, skill) => acc + skill.level, 0);
    return (total / empSkills.length).toFixed(1);
  };

  const selectedEmployeeData = selectedEmployee 
    ? employees.find(e => e.id === selectedEmployee)
    : null;

  const selectedEmployeeSkills = selectedEmployee
    ? employeeSkills.filter(es => es.employeeId === selectedEmployee).map(es => ({
        ...es,
        skillName: skills.find(s => s.id === es.skillId)?.name || 'Unknown',
        skillCategory: skills.find(s => s.id === es.skillId)?.category || 'Unknown'
      }))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600 mt-1">
            View and manage employee profiles and skill assessments
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{employees.length} employees</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Employees ({filteredEmployees.length})
              </h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  onClick={() => setSelectedEmployee(employee.id)}
                  className={`p-6 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedEmployee === employee.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{employee.name}</h4>
                        <p className="text-sm text-gray-600">{employee.role}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {employee.email}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {employee.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {getEmployeeSkillCount(employee.id)} skills
                      </div>
                      <div className="text-sm text-gray-500">
                        Avg: {getEmployeeAverageSkillLevel(employee.id)}/5
                      </div>
                      <div className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-1">
                        {employee.department}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Employee Details */}
        <div className="lg:col-span-1">
          {selectedEmployeeData ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-center mb-6">
                <img
                  src={selectedEmployeeData.avatar}
                  alt={selectedEmployeeData.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedEmployeeData.name}
                </h3>
                <p className="text-gray-600">{selectedEmployeeData.role}</p>
                <p className="text-sm text-gray-500">{selectedEmployeeData.department}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{selectedEmployeeData.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedEmployeeData.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(selectedEmployeeData.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Target className="w-4 h-4" />
                  <span>{selectedEmployeeSkills.length} skills assessed</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Skills Overview</h4>
                <div className="space-y-3">
                  {selectedEmployeeSkills.map((skill) => (
                    <div key={skill.skillId} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{skill.skillName}</span>
                        <div className="text-xs text-gray-500">{skill.skillCategory}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-2 h-2 rounded-full ${
                                level <= skill.level ? 'bg-blue-500' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {skill.level}/5
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Employee</h3>
                <p className="text-gray-600">
                  Click on an employee from the list to view their detailed profile and skills.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}