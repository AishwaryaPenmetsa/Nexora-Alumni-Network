import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const { user, apiUrl } = useAuth();

  const addToast = useCallback((text, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, text, type }]);
    
    // Auto remove toast after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    try {
      const res = await fetch(`${apiUrl}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        
        // Detect if new unread notification arrived since last fetch to trigger a Toast
        if (notifications.length > 0) {
          const newUnreads = data.filter(
            n => !n.isRead && !notifications.some(existing => existing._id === n._id)
          );
          newUnreads.forEach(newNotif => {
            addToast(newNotif.text, 'info');
          });
        }
        
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [user, apiUrl, notifications, addToast]);

  const markAsRead = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/notifications/read/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${apiUrl}/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        addToast('All notifications marked as read', 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Poll for notifications every 12 seconds when logged in
  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 12000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [user]); // We keep this simple to only bind on user changes

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      toasts,
      addToast,
      markAsRead,
      markAllAsRead,
      fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
