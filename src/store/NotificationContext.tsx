import React, { createContext, useContext, useState, useEffect } from 'react';
import { SOCNotification, NotificationType, NotificationCategory } from '../types';

interface NotificationContextType {
  notifications: SOCNotification[];
  unreadCount: number;
  addNotification: (title: string, message: string, type: NotificationType, category: NotificationCategory) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  toast: SOCNotification | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<SOCNotification[]>([
    {
      id: 'n-initial-1',
      title: 'Transformer IDS Model Loaded',
      message: 'Neural Network weights initialized (32-seq, 41 features).',
      type: 'success',
      category: 'model',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      read: false,
    },
    {
      id: 'n-initial-2',
      title: 'SocketCAN Interface Active',
      message: 'Bus interface can0 listening on 500 kbps.',
      type: 'info',
      category: 'can',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      read: false,
    },
  ]);

  const [toast, setToast] = useState<SOCNotification | null>(null);

  const addNotification = (
    title: string,
    message: string,
    type: NotificationType = 'info',
    category: NotificationCategory = 'attack'
  ) => {
    const newNotif: SOCNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      message,
      type,
      category,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [newNotif, ...prev.slice(0, 49)]);
    setToast(newNotif);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        toast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

