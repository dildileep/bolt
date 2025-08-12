import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { SkillCard } from '../components/Skills/SkillCard';
import { Plus, Search, Filter, Target } from 'lucide-react';

export function Skills() {
  const { user } = useAuth();
  const { skills, employeeSkills, updateEmployeeSkill } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const userSkills = employeeSkills.filter(es => es.employeeId === user?.id);
  
  const userSkillsWithDetails = userSkills.map(us => ({
    ...skills.find(s => s.id === us.skillId)!,
    level: us.level,
    lastUpdated: us.lastUpdated,
    assessedBy: us.assessedBy
  }));

  // Skills not yet assessed by the user
  const unassessedSkills = skills.filter(skill => 
    !userSkills.some(us => us.skillId === skill.id)
  );

  const categories = Array.from(new Set(skills.map(skill => skill.category)));

  const filteredUserSkills = userSkillsWithDetails.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || skill.category === selectedCategory)
  );

  const filteredUnassessedSkills = unassessedSkills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || skill.category === selectedCategory)
  );

  const handleSkillUpdate = (skillId: string, level: number) => {
    updateEmployeeSkill(user!.id, skillId, level);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Skills</h1>
          <p className="text-gray-600 mt-1">
            Manage and track your professional skills and competencies
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Target className="w-4 h-4" />
          <span>{userSkills.length} skills assessed</span>
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
                placeholder="Search skills..."
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Assessed Skills */}
      {filteredUserSkills.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            My Assessed Skills ({filteredUserSkills.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUserSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                level={skill.level}
                lastUpdated={skill.lastUpdated}
                assessedBy={skill.assessedBy}
                onUpdate={handleSkillUpdate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Unassessed Skills */}
      {filteredUnassessedSkills.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-blue-500" />
            Skills to Assess ({filteredUnassessedSkills.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUnassessedSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                level={0}
                onUpdate={handleSkillUpdate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredUserSkills.length === 0 && filteredUnassessedSkills.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No skills found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or filters to find skills to assess.
          </p>
        </div>
      )}
    </div>
  );
}