import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Target, Mail, Lock, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    
    // Basic validation
    if (!email.trim()) {
      setLocalError('Email is required');
      return;
    }
    
    if (!password.trim()) {
      setLocalError('Password is required');
      return;
    }
    
    try {
      await login(email.trim(), password);
    } catch (err) {
      // Error is handled by AuthContext
      console.error('Login error:', err);
    }
  };

  const demoAccounts = [
    { email: 'admin@company.com', role: 'Admin', name: 'Admin User' },
    { email: 'john@company.com', role: 'Employee', name: 'John Doe' },
    { email: 'sarah@company.com', role: 'Employee', name: 'Sarah Johnson' },
    { email: 'mike@company.com', role: 'Employee', name: 'Mike Chen' }
  ];

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setLocalError('');
  };

  const displayError = error || localError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-teal-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Target className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Skill Matrix Portal</h1>
          <p className="text-gray-600 mt-2">Sign in to manage your skills</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="your@email.com"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {displayError && (
            <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{displayError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <p className="mb-3 font-medium text-gray-800">Demo Accounts:</p>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => fillDemoAccount(account.email)}
                  className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                  disabled={isLoading}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">{account.name}</div>
                      <div className="text-xs text-gray-500">{account.email}</div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      account.role === 'Admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {account.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Click any account above to auto-fill credentials, then click "Sign In"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}