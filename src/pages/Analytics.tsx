import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, Users, Target, Award, BookOpen, Download, Filter, Calendar } from 'lucide-react';

export function Analytics() {
  const { employees, skills, employeeSkills, certifications, trainings } = useData();
  const [timeRange, setTimeRange] = useState('30');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = Array.from(new Set(employees.map(emp => emp.department)));

  // Filter data based on department
  const filteredEmployees = selectedDepartment === 'all' 
    ? employees 
    : employees.filter(emp => emp.department === selectedDepartment);

  const filteredEmployeeIds = filteredEmployees.map(emp => emp.id);

  // Key Metrics
  const totalEmployees = filteredEmployees.length;
  const totalSkills = skills.length;
  const totalAssessments = employeeSkills.filter(es => filteredEmployeeIds.includes(es.employeeId)).length;
  const avgSkillLevel = totalAssessments > 0 
    ? (employeeSkills.filter(es => filteredEmployeeIds.includes(es.employeeId)).reduce((acc, es) => acc + es.level, 0) / totalAssessments).toFixed(1)
    : '0';

  // Skills by Category
  const skillsByCategory = skills.reduce((acc: any[], skill) => {
    const existing = acc.find(item => item.name === skill.category);
    const assessmentCount = employeeSkills.filter(es => 
      es.skillId === skill.id && filteredEmployeeIds.includes(es.employeeId)
    ).length;
    
    if (existing) {
      existing.value += assessmentCount;
    } else {
      acc.push({
        name: skill.category,
        value: assessmentCount
      });
    }
    return acc;
  }, []);

  // Skill Level Distribution
  const skillLevelData = [1, 2, 3, 4, 5].map(level => ({
    level: `Level ${level}`,
    count: employeeSkills.filter(es => 
      es.level === level && filteredEmployeeIds.includes(es.employeeId)
    ).length,
    percentage: totalAssessments > 0 
      ? Math.round((employeeSkills.filter(es => 
          es.level === level && filteredEmployeeIds.includes(es.employeeId)
        ).length / totalAssessments) * 100)
      : 0
  }));

  // Department Comparison
  const departmentData = departments.map(dept => {
    const deptEmployees = employees.filter(emp => emp.department === dept);
    const deptSkills = employeeSkills.filter(es => 
      deptEmployees.some(emp => emp.id === es.employeeId)
    );
    const avgLevel = deptSkills.length > 0 
      ? (deptSkills.reduce((acc, es) => acc + es.level, 0) / deptSkills.length).toFixed(1)
      : 0;
    
    return {
      department: dept,
      employees: deptEmployees.length,
      avgSkillLevel: parseFloat(avgLevel.toString()),
      totalAssessments: deptSkills.length
    };
  });

  // Training Progress
  const trainingData = [
    { status: 'Completed', count: trainings.filter(t => t.status === 'completed').length },
    { status: 'In Progress', count: trainings.filter(t => t.status === 'in_progress').length },
    { status: 'Not Started', count: trainings.filter(t => t.status === 'not_started').length }
  ];

  // Certification Status
  const certificationData = [
    { status: 'Active', count: certifications.filter(c => c.status === 'active').length },
    { status: 'Expiring Soon', count: certifications.filter(c => c.status === 'expiring_soon').length },
    { status: 'Expired', count: certifications.filter(c => c.status === 'expired').length }
  ];

  // Top Skills
  const topSkills = skills.map(skill => {
    const assessments = employeeSkills.filter(es => 
      es.skillId === skill.id && filteredEmployeeIds.includes(es.employeeId)
    );
    const avgLevel = assessments.length > 0 
      ? (assessments.reduce((acc, es) => acc + es.level, 0) / assessments.length).toFixed(1)
      : 0;
    
    return {
      name: skill.name,
      category: skill.category,
      assessments: assessments.length,
      avgLevel: parseFloat(avgLevel.toString())
    };
  }).sort((a, b) => b.assessments - a.assessments).slice(0, 10);

  const COLORS = ['#3B82F6', '#14B8A6', '#F97316', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B', '#EC4899'];

  const exportData = () => {
    const analyticsData = {
      summary: {
        totalEmployees,
        totalSkills,
        totalAssessments,
        avgSkillLevel
      },
      skillsByCategory,
      skillLevelData,
      departmentData,
      trainingData,
      certificationData,
      topSkills,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into organizational skills and development
          </p>
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
          
          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-xl">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalAssessments}</p>
              <p className="text-sm font-medium text-gray-600">Skill Assessments</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{avgSkillLevel}/5</p>
              <p className="text-sm font-medium text-gray-600">Avg Skill Level</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-teal-100 p-3 rounded-xl">
              <Award className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{certifications.length}</p>
              <p className="text-sm font-medium text-gray-600">Certifications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skills by Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={skillsByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {skillsByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Level Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillLevelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" />
              <YAxis />
              <Tooltip formatter={(value, name) => [value, name === 'count' ? 'Assessments' : name]} />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Comparison */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgSkillLevel" fill="#14B8A6" name="Avg Skill Level" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Training Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trainingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {trainingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Skills Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Top Skills by Assessment Count</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skill
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assessments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topSkills.map((skill, index) => (
                <tr key={skill.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{skill.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {skill.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {skill.assessments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{skill.avgLevel}/5</div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(skill.avgLevel / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Skill Coverage</h4>
            <p className="text-sm text-blue-700">
              {Math.round((totalAssessments / (totalEmployees * totalSkills)) * 100)}% of possible skill assessments completed
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Training Completion</h4>
            <p className="text-sm text-green-700">
              {trainings.length > 0 ? Math.round((trainings.filter(t => t.status === 'completed').length / trainings.length) * 100) : 0}% of training courses completed
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Certification Health</h4>
            <p className="text-sm text-yellow-700">
              {certifications.filter(c => c.status === 'expiring_soon').length} certifications expiring soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}