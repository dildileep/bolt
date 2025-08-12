import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { Bell, Filter, Check, CheckCheck, Trash2, AlertTriangle, BookOpen, Award, Target, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAllNotifications } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread' | 'high' | 'medium' | 'low'>('all');
  const navigate = useNavigate();

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'high':
      case 'medium':
      case 'low':
        return notification.priority === filter;
      default:
        return true;
    }
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'certification_expiry':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'training_due':
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'skill_assessment':
        return <Target className="w-5 h-5 text-green-500" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-purple-500" />;
      case 'system':
        return <Settings className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'unread', label: 'Unread' },
                { key: 'high', label: 'High Priority' },
                { key: 'medium', label: 'Medium Priority' },
                { key: 'low', label: 'Low Priority' }
              ].map(option => (
                <button
                  key={option.key}
                  onClick={() => setFilter(option.key as any)}
                  className={clsx(
                    'px-3 py-1 text-sm rounded-full transition-colors',
                    filter === option.key
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
            </h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? "You're all caught up! Check back later for updates."
                : `No notifications match the ${filter} filter.`
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={clsx(
                  'p-6 hover:bg-gray-50 transition-colors border-l-4',
                  !notification.read ? getPriorityColor(notification.priority) : 'border-l-gray-200 bg-white'
                )}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h4 className={clsx(
                          'text-lg font-medium',
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        )}>
                          {notification.title}
                        </h4>
                        <span className={clsx(
                          'px-2 py-1 text-xs font-medium rounded-full',
                          getPriorityBadge(notification.priority)
                        )}>
                          {notification.priority} priority
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                      {notification.actionUrl && (
                        <button
                          onClick={() => handleNotificationClick(notification)}
                          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}