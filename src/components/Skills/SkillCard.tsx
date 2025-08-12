import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Star, Edit3, Check, X } from 'lucide-react';
import clsx from 'clsx';

interface SkillCardProps {
  skill: {
    id: string;
    name: string;
    category: string;
    description: string;
  };
  level?: number;
  lastUpdated?: string;
  assessedBy?: string;
  onUpdate?: (skillId: string, level: number) => void;
  readOnly?: boolean;
}

export function SkillCard({ skill, level = 0, lastUpdated, assessedBy, onUpdate, readOnly = false }: SkillCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempLevel, setTempLevel] = useState(level);
  const { user } = useAuth();

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(skill.id, tempLevel);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempLevel(level);
    setIsEditing(false);
  };

  const renderStars = (currentLevel: number, isInteractive = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => isInteractive && setTempLevel(star)}
            disabled={!isInteractive}
            className={clsx(
              'w-5 h-5 transition-colors',
              isInteractive && 'hover:scale-110 cursor-pointer',
              star <= currentLevel ? 'text-yellow-400' : 'text-gray-300'
            )}
          >
            <Star className="w-full h-full fill-current" />
          </button>
        ))}
      </div>
    );
  };

  const getLevelText = (level: number) => {
    const levels = ['Not assessed', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
    return levels[level] || 'Not assessed';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Frontend': 'bg-blue-100 text-blue-800',
      'Backend': 'bg-green-100 text-green-800',
      'Database': 'bg-purple-100 text-purple-800',
      'DevOps': 'bg-orange-100 text-orange-800',
      'Cloud': 'bg-teal-100 text-teal-800',
      'Programming': 'bg-indigo-100 text-indigo-800',
      'AI/ML': 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{skill.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(skill.category)}`}>
              {skill.category}
            </span>
          </div>
          <p className="text-sm text-gray-600">{skill.description}</p>
        </div>
        
        {!readOnly && user?.role === 'employee' && (
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Skill Level:</span>
          <span className={clsx(
            'text-sm font-medium',
            level >= 4 ? 'text-green-600' : level >= 3 ? 'text-yellow-600' : level >= 2 ? 'text-orange-600' : 'text-gray-600'
          )}>
            {getLevelText(isEditing ? tempLevel : level)}
          </span>
        </div>
        
        {renderStars(isEditing ? tempLevel : level, isEditing)}
        
        {lastUpdated && (
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
            Last updated: {new Date(lastUpdated).toLocaleDateString()}
            {assessedBy && (
              <span className="ml-2">• Assessed by {assessedBy}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}