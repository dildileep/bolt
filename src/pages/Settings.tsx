import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Download, Upload, Trash2, Save } from 'lucide-react';

export function Settings() {
  const { user } = useAuth();
  const { exportData, bulkAddEmployees, bulkAddSkills } = useData();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    skillReminders: true,
    certificationAlerts: true,
    trainingUpdates: true
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data Management', icon: Database }
  ];

  const handleBulkUpload = (type: 'employees' | 'skills') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let data: any[] = [];

        if (file.name.endsWith('.json')) {
          data = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          data = lines.slice(1).filter(line => line.trim()).map(line => {
            const values = line.split(',').map(v => v.trim());
            const item: any = {};
            headers.forEach((header, index) => {
              item[header] = values[index] || '';
            });
            return item;
          });
        }

        if (type === 'employees') {
          const validEmployees = data.filter(emp => 
            emp.name && emp.email && emp.role && emp.department
          ).map(emp => ({
            name: emp.name,
            email: emp.email,
            role: emp.role,
            department: emp.department,
            location: emp.location || 'Not specified',
            joinDate: emp.joinDate || new Date().toISOString().split('T')[0],
            avatar: emp.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`
          }));

          if (validEmployees.length > 0) {
            bulkAddEmployees(validEmployees);
            alert(`Successfully added ${validEmployees.length} employees!`);
          } else {
            alert('No valid employees found in the file.');
          }
        } else if (type === 'skills') {
          const validSkills = data.filter(skill => 
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
            alert('No valid skills found in the file.');
          }
        }
      } catch (error) {
        alert('Error reading file. Please check the format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('skillMatrix_')) {
          localStorage.removeItem(key);
        }
      });
      alert('All data has been cleared. Please refresh the page.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account preferences and system configuration
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={user?.role || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={user?.department || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    readOnly
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  Profile information is managed by your administrator. Contact your HR department to update these details.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
              
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                        {key === 'skillReminders' && 'Get reminders to update your skill assessments'}
                        {key === 'certificationAlerts' && 'Alerts for expiring certifications'}
                        {key === 'trainingUpdates' && 'Notifications about new training assignments'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotifications({
                          ...notifications,
                          [key]: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Account Security</h4>
                  <p className="text-sm text-green-700">
                    Your account is secured with industry-standard encryption and authentication.
                  </p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Session Management</h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Your session will automatically expire after 24 hours of inactivity.
                  </p>
                  <button className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg hover:bg-yellow-200 transition-colors">
                    End All Sessions
                  </button>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Data Privacy</h4>
                  <p className="text-sm text-blue-700">
                    Your personal data is stored securely and is only accessible to authorized personnel.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && user?.role === 'admin' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
              
              {/* Export Data */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Export Data</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['employees', 'skills', 'certifications', 'trainings'].map((type) => (
                    <button
                      key={type}
                      onClick={() => exportData(type as any)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="capitalize">{type}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Import Data */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Import Data</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bulk Upload Employees
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".json,.csv"
                        onChange={handleBulkUpload('employees')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Upload Employees</span>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bulk Upload Skills
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".json,.csv"
                        onChange={handleBulkUpload('skills')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Upload Skills</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Supported formats:</strong> JSON and CSV files. 
                    Ensure your files contain the required fields for successful import.
                  </p>
                </div>
              </div>
              
              {/* Danger Zone */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="font-medium text-red-900 mb-4">Danger Zone</h4>
                <p className="text-sm text-red-700 mb-4">
                  This action will permanently delete all data from the system. This cannot be undone.
                </p>
                <button
                  onClick={clearAllData}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All Data</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'data' && user?.role !== 'admin' && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
              <p className="text-gray-600">
                Data management features are only available to administrators.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}