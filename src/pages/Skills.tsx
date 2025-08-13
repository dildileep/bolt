import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { SkillCard } from '../components/Skills/SkillCard';
import { AddSkillModal } from '../components/Skills/AddSkillModal';
import { Plus, Search, Filter, Target, Upload } from 'lucide-react';

export function Skills() {
  const { user } = useAuth();
  const { skills, employeeSkills, updateEmployeeSkill, addSkill, bulkAddSkills } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const userSkills = employeeSkills.filter(es => es.employeeId === user?.id);
  
  const userSkillsWithDetails = userSkills.map(us => ({
    ...skills.find(s => s.id === us.skillId)!,
    level: us.level,
    lastUpdated: us.lastUpdated,
    assessedBy: us.assessedBy
  })).filter(skill => skill.name); // Filter out undefined skills

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

  const handleAddSkill = (skillData: { name: string; category: string; description: string }) => {
    addSkill(skillData);
    setShowAddModal(false);
  };

  const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let skillsData: any[] = [];

        if (file.name.endsWith('.json')) {
          skillsData = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          skillsData = lines.slice(1).filter(line => line.trim()).map(line => {
            const values = line.split(',').map(v => v.trim());
            const skill: any = {};
            headers.forEach((header, index) => {
              skill[header] = values[index] || '';
            });
            return skill;
          });
        }

        const validSkills = skillsData.filter(skill => 
          skill.name && skill.category && skill.description
        ).map(skill => ({
          name: skill.name,
          category: skill.category,
          description: skill.description
        }));

        if (validSkills.length > 0) {
          bulkAddSkills(validSkills);
          alert(`Successfully added ${validSkills.length} skills!`);
        } else {
          alert('No valid skills found in the file. Please check the format.');
        }
      } catch (error) {
        alert('Error reading file. Please check the format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
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
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Target className="w-4 h-4" />
            <span>{userSkills.length} skills assessed</span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
            
            {user?.role === 'admin' && (
              <div className="relative">
                <input
                  type="file"
                  accept=".json,.csv"
                  onChange={handleBulkUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Bulk Upload</span>
                </button>
              </div>
            )}
          </div>
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

      {/* Add Skill Modal */}
      {showAddModal && (
        <AddSkillModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddSkill}
        />
      )}
    </div>
  );
}