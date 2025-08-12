import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { BookOpen, Clock, CheckCircle, PlayCircle, Calendar, TrendingUp } from 'lucide-react';

export function Training() {
  const { user } = useAuth();
  const { trainings, updateTrainingProgress } = useData();

  const userTrainings = trainings.filter(t => t.assignedTo === user?.id);
  const inProgress = userTrainings.filter(t => t.status === 'in_progress');
  const notStarted = userTrainings.filter(t => t.status === 'not_started');
  const completed = userTrainings.filter(t => t.status === 'completed');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <PlayCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Not Started';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Training</h1>
          <p className="text-gray-600 mt-1">
            Track your learning progress and complete assigned courses
          </p>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>{completed.length}/{userTrainings.length} completed</span>
          </div>
        </div>
      </div>

      {/* Training Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-xl">
              <PlayCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{inProgress.length}</p>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{notStarted.length}</p>
              <p className="text-sm font-medium text-gray-600">Not Started</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{completed.length}</p>
              <p className="text-sm font-medium text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Training */}
      {inProgress.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Continue Learning</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {inProgress.map((training) => (
              <div key={training.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{training.courseName}</h3>
                    <p className="text-sm text-gray-600 mt-1">{training.description}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(training.status)}`}>
                    {getStatusText(training.status)}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
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
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(training.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                    Continue Course
                  </button>
                  {training.progress < 100 && (
                    <button
                      onClick={() => updateTrainingProgress(training.id, Math.min(100, training.progress + 10))}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      +10%
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Training */}
      {notStarted.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Assigned Training</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {notStarted.map((training) => (
              <div key={training.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{training.courseName}</h3>
                    <p className="text-sm text-gray-600 mt-1">{training.description}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(training.status)}`}>
                    {getStatusText(training.status)}
                  </span>
                </div>
                
                {training.dueDate && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(training.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
                
                <button
                  onClick={() => updateTrainingProgress(training.id, 10)}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Start Course</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Training */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed Training</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {completed.map((training) => (
                <div key={training.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{training.courseName}</h3>
                        <p className="text-sm text-gray-600">{training.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Completed
                      </span>
                      <div className="text-sm text-gray-500 mt-1">100% Complete</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {userTrainings.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No training assigned</h3>
          <p className="text-gray-600 mb-6">
            Once training courses are assigned to you, they will appear here.
          </p>
        </div>
      )}
    </div>
  );
}