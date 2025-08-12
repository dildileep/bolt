import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';

export interface Notification {
  id: string;
  type: 'certification_expiry' | 'training_due' | 'skill_assessment' | 'system' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { certifications, trainings, employeeSkills } = useData();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate notifications based on data
  useEffect(() => {
    if (!user) return;

    const newNotifications: Notification[] = [];

    // Certification expiry notifications
    const userCertifications = certifications.filter(c => c.employeeId === user.id);
    userCertifications.forEach(cert => {
      if (cert.status === 'expiring_soon') {
        const daysUntilExpiry = Math.ceil(
          (new Date(cert.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        newNotifications.push({
          id: `cert-expiry-${cert.id}`,
          type: 'certification_expiry',
          title: 'Certification Expiring Soon',
          message: `Your ${cert.name} certification expires in ${daysUntilExpiry} days`,
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'high',
          actionUrl: '/certifications',
          metadata: { certificationId: cert.id, daysUntilExpiry }
        });
      }
    });

    // Training due notifications
    const userTrainings = trainings.filter(t => t.assignedTo === user.id);
    userTrainings.forEach(training => {
      if (training.status === 'not_started' && training.dueDate) {
        const daysUntilDue = Math.ceil(
          (new Date(training.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysUntilDue <= 7 && daysUntilDue > 0) {
          newNotifications.push({
            id: `training-due-${training.id}`,
            type: 'training_due',
            title: 'Training Due Soon',
            message: `${training.courseName} is due in ${daysUntilDue} days`,
            timestamp: new Date().toISOString(),
            read: false,
            priority: 'medium',
            actionUrl: '/training',
            metadata: { trainingId: training.id, daysUntilDue }
          });
        }
      }
    });

    // Skill assessment reminders
    const userSkills = employeeSkills.filter(es => es.employeeId === user.id);
    const lastAssessment = userSkills.reduce((latest, skill) => {
      const skillDate = new Date(skill.lastUpdated);
      return skillDate > latest ? skillDate : latest;
    }, new Date(0));

    const daysSinceLastAssessment = Math.floor(
      (new Date().getTime() - lastAssessment.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastAssessment > 30) {
      newNotifications.push({
        id: 'skill-assessment-reminder',
        type: 'skill_assessment',
        title: 'Skill Assessment Reminder',
        message: `It's been ${daysSinceLastAssessment} days since your last skill update`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'low',
        actionUrl: '/skills',
        metadata: { daysSinceLastAssessment }
      });
    }

    // Admin-specific notifications
    if (user.role === 'admin') {
      const allExpiringCerts = certifications.filter(c => c.status === 'expiring_soon');
      if (allExpiringCerts.length > 0) {
        newNotifications.push({
          id: 'admin-cert-expiry',
          type: 'system',
          title: 'Team Certifications Expiring',
          message: `${allExpiringCerts.length} team certifications are expiring soon`,
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'high',
          actionUrl: '/employees',
          metadata: { count: allExpiringCerts.length }
        });
      }

      const pendingTrainings = trainings.filter(t => t.status === 'not_started').length;
      if (pendingTrainings > 0) {
        newNotifications.push({
          id: 'admin-pending-training',
          type: 'system',
          title: 'Pending Training Assignments',
          message: `${pendingTrainings} training courses haven't been started yet`,
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'medium',
          actionUrl: '/analytics',
          metadata: { count: pendingTrainings }
        });
      }
    }

    // Welcome notification for new users
    const isNewUser = !localStorage.getItem(`skillMatrix_welcomed_${user.id}`);
    if (isNewUser) {
      newNotifications.push({
        id: 'welcome-notification',
        type: 'system',
        title: 'Welcome to Skill Matrix Portal!',
        message: user.role === 'admin' 
          ? 'Explore the admin dashboard to manage your team\'s skills and development'
          : 'Start by updating your skills and exploring available training courses',
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'low',
        actionUrl: user.role === 'admin' ? '/dashboard' : '/skills',
        metadata: { isWelcome: true }
      });
      localStorage.setItem(`skillMatrix_welcomed_${user.id}`, 'true');
    }

    // Load existing notifications from localStorage
    const savedNotifications = localStorage.getItem(`skillMatrix_notifications_${user.id}`);
    const existingNotifications = savedNotifications ? JSON.parse(savedNotifications) : [];

    // Merge new notifications with existing ones (avoid duplicates)
    const allNotifications = [...existingNotifications];
    newNotifications.forEach(newNotif => {
      if (!allNotifications.find(existing => existing.id === newNotif.id)) {
        allNotifications.push(newNotif);
      }
    });

    // Sort by timestamp (newest first) and limit to 50 notifications
    const sortedNotifications = allNotifications
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50);

    setNotifications(sortedNotifications);
    localStorage.setItem(`skillMatrix_notifications_${user.id}`, JSON.stringify(sortedNotifications));
  }, [user, certifications, trainings, employeeSkills]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      if (user) {
        localStorage.setItem(`skillMatrix_notifications_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      if (user) {
        localStorage.setItem(`skillMatrix_notifications_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 50);
      if (user) {
        localStorage.setItem(`skillMatrix_notifications_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      if (user) {
        localStorage.setItem(`skillMatrix_notifications_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    if (user) {
      localStorage.removeItem(`skillMatrix_notifications_${user.id}`);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      addNotification,
      removeNotification,
      clearAllNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}